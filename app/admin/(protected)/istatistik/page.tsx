import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminQrStats from "@/components/admin/AdminQrStats";
import { getAdminContext } from "@/lib/admin/get-admin-context";
import { loadQrStats } from "@/lib/admin/load-qr-stats";
import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

export const metadata: Metadata = {
  title: "QR istatistik · Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const { tenant } = await getAdminContext();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=config");

  let stats;
  try {
    stats = await loadQrStats(supabase, tenant.id);
  } catch {
    return (
      <div className="space-y-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950 ring-1 ring-amber-200">
        <p className="font-semibold">QR sayacı henüz kurulmamış</p>
        <p>
          Supabase SQL Editor’da{" "}
          <code className="rounded bg-white/80 px-1">
            supabase/migrations/20250912150000_qr_scan_events.sql
          </code>{" "}
          dosyasını çalıştırın, ardından sayfayı yenileyin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-extrabold text-ink">QR okutmalar</h2>
        <p className="mt-1 text-sm text-ink/60">Masa / vitrin QR performansı</p>
      </div>
      <AdminQrStats stats={stats} />
    </div>
  );
}
