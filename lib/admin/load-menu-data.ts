import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminCategory,
  AdminProductDetail,
  AdminProductListItem,
} from "@/lib/admin/types";

type NamedRow = { locale: string; name: string };
type ProductTrRow = NamedRow & {
  description: string | null;
};

function pickName(rows: NamedRow[] | null | undefined, locale: string) {
  return rows?.find((r) => r.locale === locale)?.name ?? rows?.[0]?.name ?? "";
}

export async function loadAdminCategories(
  supabase: SupabaseClient,
  tenantId: string,
  locale: string,
): Promise<AdminCategory[]> {
  const { data } = await supabase
    .from("categories")
    .select("id, slug, sort_order, category_translations(locale, name)")
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    sortOrder: row.sort_order,
    name: pickName(row.category_translations as NamedRow[] | null, locale) || row.slug,
  }));
}

export async function loadAdminProducts(
  supabase: SupabaseClient,
  tenantId: string,
  locale: string,
): Promise<AdminProductListItem[]> {
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, category_id, price_cents, image_url, is_available, sort_order, product_translations(locale, name)",
    )
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    name:
      pickName(row.product_translations as NamedRow[] | null, locale) || row.slug,
    priceCents: row.price_cents,
    imageUrl: row.image_url,
    isAvailable: row.is_available,
    sortOrder: row.sort_order,
  }));
}

export async function loadAdminProduct(
  supabase: SupabaseClient,
  tenantId: string,
  productId: string,
  locale: string,
): Promise<AdminProductDetail | null> {
  const { data: row } = await supabase
    .from("products")
    .select(
      "id, slug, category_id, price_cents, image_url, portion_note, is_available, sort_order, product_translations(locale, name, description)",
    )
    .eq("tenant_id", tenantId)
    .eq("id", productId)
    .maybeSingle();

  if (!row) return null;

  const translations = row.product_translations as ProductTrRow[] | null;
  const tr =
    translations?.find((t) => t.locale === locale) ?? translations?.[0];

  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    name: tr?.name ?? row.slug,
    description: tr?.description ?? "",
    priceCents: row.price_cents,
    imageUrl: row.image_url,
    isAvailable: row.is_available,
    sortOrder: row.sort_order,
    portionNote: row.portion_note,
  };
}
