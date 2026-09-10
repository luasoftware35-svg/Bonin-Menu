import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import { getAdminContext } from "@/lib/admin/get-admin-context";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

export const metadata: Metadata = {
  title: "Ayarlar · Admin",
};

export default async function AdminSettingsPage() {
  const { tenant } = await getAdminContext();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");

  const { data: row } = await supabase
    .from("tenants")
    .select("tagline, slogan, instagram, hours, address")
    .eq("id", tenant.id)
    .single();

  return (
    <AdminSettingsForm
      tenant={tenant}
      initial={{
        tagline: row?.tagline ?? "",
        slogan: row?.slogan ?? "",
        instagram: row?.instagram ?? "",
        hours: row?.hours ?? "",
        address: row?.address ?? "",
      }}
    />
  );
}
