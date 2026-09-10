"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdminField, adminInputClass } from "@/components/admin/AdminField";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/menu";
  const errorParam = searchParams.get("error");
  const configError = errorParam === "yetki";
  const supabaseMissing = errorParam === "config";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    supabaseMissing
      ? "Supabase bağlantısı yapılandırılmamış (Vercel ortam değişkenleri)."
      : configError
        ? "Bu hesabın menü düzenleme yetkisi yok. Yöneticiniz tenant_admins kaydı eklemeli."
        : null,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase ayarları eksik. Vercel ortam değişkenlerini kontrol edin.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setMessage("Giriş başarısız. E-posta veya şifreyi kontrol edin.");
      return;
    }

    router.push(next.startsWith("/admin") ? next : "/admin/menu");
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
      <AdminField label="E-posta" htmlFor="email">
        <input
          id="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          className={adminInputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </AdminField>

      <AdminField label="Şifre" htmlFor="password">
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className={adminInputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </AdminField>

      {message ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-cocoa font-display text-base font-extrabold text-white shadow-md disabled:opacity-60"
      >
        {loading ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
