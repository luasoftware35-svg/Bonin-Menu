/**
 * Orman Meyveli Muffin adını düzeltir; mükerrer ürün varsa birleştirir.
 * SUPABASE_SERVICE_ROLE_KEY ile: npx tsx scripts/fix-orman-muffin.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]!.trim();
    }
  } catch {
    /* yerelde .env.local yoksa shell env kullanılır */
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TENANT_ID = "bfd11f78-2db4-4b29-b724-4d4a4c5457ad";
const CANONICAL_NAME = "Orman Meyveli Muffin";

async function main() {
  const { data: rows, error } = await supabase
    .from("product_translations")
    .select("product_id, locale, name, products!inner(id, slug, tenant_id, is_available)")
    .eq("products.tenant_id", TENANT_ID)
    .ilike("name", "%Orman%Muffin%");

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.log("Bulunan kayıtlar:", rows?.length ?? 0);
  for (const row of rows ?? []) {
    const p = row.products as { id: string; slug: string; is_available: boolean };
    console.log(`- ${row.name} (${p.slug}) id=${p.id}`);
  }

  const bad = (rows ?? []).filter((r) => r.name !== CANONICAL_NAME);

  for (const row of bad) {
    const { error: upErr } = await supabase
      .from("product_translations")
      .update({ name: CANONICAL_NAME })
      .eq("product_id", row.product_id)
      .eq("locale", row.locale);

    if (upErr) {
      console.error("Güncelleme hatası:", upErr.message);
      process.exit(1);
    }
    console.log(`Güncellendi: ${row.name} → ${CANONICAL_NAME}`);
  }

  const { data: all } = await supabase
    .from("products")
    .select("id, slug, product_translations(name, locale)")
    .eq("tenant_id", TENANT_ID)
    .order("slug");

  const muffins = (all ?? []).filter(
    (p) =>
      p.slug.includes("muffin") ||
      (p.product_translations as { name: string }[] | null)?.some((t) =>
        t.name.toLowerCase().includes("muffin"),
      ),
  );
  console.log("\nTüm muffin kayıtları:");
  for (const p of muffins) {
    const names = (p.product_translations as { name: string; locale: string }[])
      .map((t) => `${t.locale}:${t.name}`)
      .join(", ");
    console.log(`  ${p.slug} → ${names}`);
  }

  const { data: dashed } = await supabase
    .from("product_translations")
    .select("product_id, locale, name")
    .eq("locale", "tr")
    .like("name", "%-%");

  console.log("\nAdında tire (-) geçen çeviriler:");
  for (const row of dashed ?? []) {
    console.log(`  ${row.name} (${row.product_id})`);
  }

  const productId = "fd3e6d60-4161-4efc-a7d8-49db5d3ecc3d";
  const { data: trRows } = await supabase
    .from("product_translations")
    .select("*")
    .eq("product_id", productId);
  console.log("\nTüm çeviriler (orman ürün):", trRows);

  const anon = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: anonRow } = await anon
    .from("products")
    .select("id, product_translations(name, locale)")
    .eq("id", productId)
    .maybeSingle();
  console.log("\nAnon ile okunan:", anonRow);

  console.log("Tamam.");
}

main();
