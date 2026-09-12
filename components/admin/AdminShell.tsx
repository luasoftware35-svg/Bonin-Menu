"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminTenant } from "@/lib/admin/types";

const nav = [
  { href: "/admin/menu", label: "Menü", icon: "☰" },
  { href: "/admin/istatistik", label: "QR", icon: "📊" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: "⚙" },
] as const;

export default function AdminShell({
  tenant,
  children,
}: {
  tenant: AdminTenant;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const hideNav =
    pathname.startsWith("/admin/menu/") && pathname !== "/admin/menu";

  return (
    <div className="min-h-[100dvh] bg-[#f5eee4] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-30 border-b border-cocoa/10 bg-[#f5eee4]/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-cocoa/60">
          Yönetim
        </p>
        <h1 className="font-display text-lg font-extrabold text-ink">
          {tenant.name}
        </h1>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4">{children}</main>

      {!hideNav ? (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-cocoa/15 bg-[#faf6f0] pb-[env(safe-area-inset-bottom)]"
          aria-label="Admin gezinme"
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-around">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 text-sm font-semibold transition-colors ${
                    active ? "text-cocoa" : "text-ink/50"
                  }`}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 text-sm font-semibold text-ink/50"
            >
              <span className="text-lg leading-none" aria-hidden>
                ↪
              </span>
              Çıkış
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
