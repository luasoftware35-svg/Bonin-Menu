/**
 * Tek ürün görseli güncelle (ör. npx tsx scripts/update-product-image.ts BBQ /menu/bbq-pizza.jpg)
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
    /* ignore */
  }
}

loadEnvLocal();

const productName = process.argv[2];
const imagePath = process.argv[3];

if (!productName || !imagePath) {
  console.error("Kullanım: npx tsx scripts/update-product-image.ts <ürün adı> <görsel yolu>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: tr, error: findErr } = await supabase
    .from("product_translations")
    .select("product_id, name")
    .eq("locale", "tr")
    .eq("name", productName)
    .maybeSingle();

  if (findErr || !tr) {
    console.error(findErr?.message ?? "Ürün bulunamadı:", productName);
    process.exit(1);
  }

  const { error: upErr } = await supabase
    .from("products")
    .update({ image_url: imagePath })
    .eq("id", tr.product_id);

  if (upErr) {
    console.error(upErr.message);
    process.exit(1);
  }

  console.log(`Güncellendi: ${tr.name} → ${imagePath}`);
}

main();
