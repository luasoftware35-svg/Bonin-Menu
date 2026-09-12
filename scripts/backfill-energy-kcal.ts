/**
 * Seed menüdeki kcal değerlerini Supabase ürünlerine yazar (isim eşleşmesi).
 * npx tsx scripts/backfill-energy-kcal.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { boninMenu } from "../lib/seed/bonin";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]!.trim();
    }
  } catch {
    /* ignore */
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!url || !serviceKey) {
  console.error("Supabase URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TENANT_ID = "bfd11f78-2db4-4b29-b724-4d4a4c5457ad";

const kcalByName = new Map<string, { kcal: number; portion: string }>();
for (const cat of boninMenu.categories) {
  for (const p of cat.products) {
    kcalByName.set(p.name.trim().toLocaleLowerCase("tr"), {
      kcal: p.energyKcal ?? 0,
      portion: p.portionNote ?? "porsiyon",
    });
  }
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, portion_note, energy_kcal, product_translations(name, locale)")
    .eq("tenant_id", TENANT_ID);

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const row of products ?? []) {
    const translations = row.product_translations as { name: string; locale: string }[];
    const trName =
      translations.find((t) => t.locale === "tr")?.name ?? translations[0]?.name;
    if (!trName) {
      skipped += 1;
      continue;
    }

    const seed = kcalByName.get(trName.trim().toLocaleLowerCase("tr"));
    if (!seed) {
      console.warn("Seed eşleşmedi:", trName);
      skipped += 1;
      continue;
    }

    const { error: upErr } = await supabase
      .from("products")
      .update({
        energy_kcal: seed.kcal,
        portion_note: row.portion_note ?? seed.portion,
      })
      .eq("id", row.id);

    if (upErr) {
      console.error(trName, upErr.message);
      process.exit(1);
    }
    updated += 1;
  }

  console.log(`Güncellendi: ${updated}, atlandı: ${skipped}`);
}

main();
