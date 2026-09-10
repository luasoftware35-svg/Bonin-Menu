import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";
import type { AdminTenant } from "@/lib/admin/types";

type AdminContext = {
  userId: string;
  tenant: AdminTenant;
};

export async function getAdminContext(): Promise<AdminContext> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login?error=config");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: row, error } = await supabase
    .from("tenant_admins")
    .select("tenant_id, tenants (id, slug, name, default_locale)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const tenantRaw = row?.tenants;
  const t = Array.isArray(tenantRaw) ? tenantRaw[0] : tenantRaw;

  if (error || !t) {
    redirect("/admin/login?error=yetki");
  }

  return {
    userId: user.id,
    tenant: {
      id: t.id,
      slug: t.slug,
      name: t.name,
      defaultLocale: t.default_locale ?? "tr",
    },
  };
}
