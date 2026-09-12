import { Suspense } from "react";
import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { BrandLogo } from "@/components/menu/BrandLogo";

export const metadata: Metadata = {
  title: "Admin giriş · BONİN",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f5eee4] px-4 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto w-[min(100%,10.5rem)] pt-2">
          <BrandLogo priority />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-cocoa/60">
            BONİN Menü
          </p>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Yönetim paneli
          </h1>
          <p className="mt-2 text-sm text-ink/65">
            Telefondan ürün adı, fiyat ve fotoğraf güncelleyebilirsiniz.
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-ink/50">Yükleniyor…</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
