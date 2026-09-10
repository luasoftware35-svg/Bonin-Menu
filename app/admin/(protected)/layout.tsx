import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminContext } from "@/lib/admin/get-admin-context";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant } = await getAdminContext();
  return <AdminShell tenant={tenant}>{children}</AdminShell>;
}
