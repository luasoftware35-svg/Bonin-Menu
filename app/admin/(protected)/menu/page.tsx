import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminMenuClient from "@/components/admin/AdminMenuClient";
import { getAdminContext } from "@/lib/admin/get-admin-context";
import { loadAdminCategories, loadAdminProducts } from "@/lib/admin/load-menu-data";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

export const metadata: Metadata = {
  title: "Menü düzenle · Admin",
};

export default async function AdminMenuPage() {
  const { tenant } = await getAdminContext();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");
  const locale = tenant.defaultLocale;

  const [categories, products] = await Promise.all([
    loadAdminCategories(supabase, tenant.id, locale),
    loadAdminProducts(supabase, tenant.id, locale),
  ]);

  return (
    <AdminMenuClient tenant={tenant} categories={categories} products={products} />
  );
}
