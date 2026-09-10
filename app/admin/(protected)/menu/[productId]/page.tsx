import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminProductEditor from "@/components/admin/AdminProductEditor";
import { getAdminContext } from "@/lib/admin/get-admin-context";
import { loadAdminProduct } from "@/lib/admin/load-menu-data";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

export const metadata: Metadata = {
  title: "Ürün düzenle · Admin",
};

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const { tenant } = await getAdminContext();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");

  const product = await loadAdminProduct(
    supabase,
    tenant.id,
    productId,
    tenant.defaultLocale,
  );

  if (!product) notFound();

  return <AdminProductEditor tenant={tenant} product={product} />;
}
