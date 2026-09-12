/**
 * Bonin menüsünü Supabase'e yükler (tek seferlik).
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:supabase
 *
 * Service role key: Dashboard → Project Settings → API → service_role (secret)
 */

import { createClient } from "@supabase/supabase-js";
import { boninMenu } from "../lib/seed/bonin";

const url =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!url || !serviceKey) {
  console.error(
    "SUPABASE_URL (veya NEXT_PUBLIC_SUPABASE_URL) ve SUPABASE_SERVICE_ROLE_KEY gerekli.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: existing } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", boninMenu.tenant.slug)
    .maybeSingle();

  if (existing) {
    console.log("Tenant 'bonin' zaten var (id:", existing.id, "). Import atlandı.");
    process.exit(0);
  }

  const t = boninMenu.tenant;

  const { data: tenantRow, error: tenantError } = await supabase
    .from("tenants")
    .insert({
      slug: t.slug,
      name: t.name,
      tagline: t.tagline,
      slogan: t.slogan,
      logo_url: t.logoUrl,
      address: t.address,
      hours: t.hours,
      instagram: t.instagram,
      maps_url: t.mapsUrl,
      currency: t.currency,
      default_locale: t.locale,
      is_active: true,
    })
    .select("id")
    .single();

  if (tenantError || !tenantRow) {
    console.error("Tenant insert:", tenantError?.message);
    process.exit(1);
  }

  const tenantId = tenantRow.id;
  console.log("Tenant oluşturuldu:", tenantId);

  let catOrder = 0;
  for (const cat of boninMenu.categories) {
    catOrder += 1;
    const { data: catRow, error: catError } = await supabase
      .from("categories")
      .insert({
        tenant_id: tenantId,
        slug: cat.slug,
        sort_order: catOrder,
      })
      .select("id")
      .single();

    if (catError || !catRow) {
      console.error("Category", cat.slug, catError?.message);
      process.exit(1);
    }

    const { error: catTrError } = await supabase.from("category_translations").insert({
      category_id: catRow.id,
      locale: t.locale,
      name: cat.name,
    });

    if (catTrError) {
      console.error("Category translation", cat.slug, catTrError.message);
      process.exit(1);
    }

    let prodOrder = 0;
    for (const p of cat.products) {
      prodOrder += 1;
      const { data: prodRow, error: prodError } = await supabase
        .from("products")
        .insert({
          tenant_id: tenantId,
          category_id: catRow.id,
          slug: p.slug,
          price_cents: p.priceCents ?? 0,
          image_url: p.imageUrl,
          allergens: p.allergens,
          portion_note: p.portionNote,
          energy_kcal: p.energyKcal,
          is_available: p.isAvailable,
          sort_order: prodOrder,
        })
        .select("id")
        .single();

      if (prodError || !prodRow) {
        console.error("Product", p.name, prodError?.message);
        process.exit(1);
      }

      const { error: prodTrError } = await supabase.from("product_translations").insert({
        product_id: prodRow.id,
        locale: t.locale,
        name: p.name,
        description: p.description,
        ingredients_note: p.ingredientsNote,
      });

      if (prodTrError) {
        console.error("Product translation", p.name, prodTrError.message);
        process.exit(1);
      }
    }

    console.log("  ✓", cat.name, `(${cat.products.length} ürün)`);
  }

  console.log("\nBitti. tenant_id (Zeynep için tenant_admins):", tenantId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
