import { boninMenu } from "@/lib/seed/bonin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, MenuData, Product, Tenant } from "@/lib/types";

type NamedTranslation = { locale: string; name: string };
type ProductTranslation = NamedTranslation & {
  description: string | null;
  ingredients_note: string | null;
};

function pickTranslation<T extends { locale: string }>(
  rows: T[] | null | undefined,
  locale: string,
) {
  return rows?.find((row) => row.locale === locale) ?? rows?.[0];
}

export async function getMenuBySlug(slug: string): Promise<MenuData | null> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return slug === boninMenu.tenant.slug ? boninMenu : null;
  }

  const { data: tenantRow, error: tenantError } = await supabase
    .from("tenants")
    .select(
      "id, slug, name, tagline, logo_url, address, hours, instagram, maps_url, currency, default_locale",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (tenantError || !tenantRow) {
    return slug === boninMenu.tenant.slug ? boninMenu : null;
  }

  const locale: string = tenantRow.default_locale ?? "tr";

  const { data: categoryRows } = await supabase
    .from("categories")
    .select("id, slug, sort_order, category_translations(locale, name)")
    .eq("tenant_id", tenantRow.id)
    .order("sort_order", { ascending: true });

  const { data: productRows } = await supabase
    .from("products")
    .select(
      "id, slug, category_id, price_cents, image_url, allergens, portion_note, is_available, sort_order, product_translations(locale, name, description, ingredients_note)",
    )
    .eq("tenant_id", tenantRow.id)
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  const tenant: Tenant = {
    id: tenantRow.id,
    slug: tenantRow.slug,
    name: tenantRow.name,
    tagline: tenantRow.tagline ?? "",
    slogan: null,
    logoUrl: tenantRow.logo_url,
    address: tenantRow.address ?? "",
    hours: tenantRow.hours ?? "",
    instagram:
      tenantRow.instagram ??
      (slug === boninMenu.tenant.slug ? boninMenu.tenant.instagram : null),
    mapsUrl: tenantRow.maps_url,
    currency: tenantRow.currency ?? "EUR",
    locale,
  };

  const productsByCategory = new Map<string, Product[]>();

  for (const row of productRows ?? []) {
    const translations = row.product_translations as ProductTranslation[] | null;
    const translation = pickTranslation(translations, locale);
    const product: Product = {
      id: row.id,
      slug: row.slug,
      name: translation?.name ?? row.slug,
      description: translation?.description ?? "",
      priceCents: row.price_cents,
      imageUrl: row.image_url,
      allergens: row.allergens ?? [],
      energyKcal: null,
      portionNote: row.portion_note,
      ingredientsNote: translation?.ingredients_note ?? null,
      isAvailable: row.is_available,
    };
    const list = productsByCategory.get(row.category_id) ?? [];
    list.push(product);
    productsByCategory.set(row.category_id, list);
  }

  const categories: Category[] = (categoryRows ?? []).map((row) => {
    const translations = row.category_translations as NamedTranslation[] | null;
    const translation = pickTranslation(translations, locale);
    return {
      id: row.id,
      slug: row.slug,
      name: translation?.name ?? row.slug,
      products: productsByCategory.get(row.id) ?? [],
    };
  });

  return { tenant, categories };
}
