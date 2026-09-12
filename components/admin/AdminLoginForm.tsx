"use client";

import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import {
  adminLoginAction,
  type LoginState,
} from "@/app/admin/login/actions";
import { AdminField, adminInputClass } from "@/components/admin/AdminField";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-cocoa font-display text-base font-extrabold text-white shadow-md disabled:opacity-60"
    >
      {pending ? "Giriş yapılıyor…" : "Giriş yap"}
    </button>
  );
}

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/menu";
  const errorParam = searchParams.get("error");

  const urlMessage =
    errorParam === "config"
      ? "Supabase bağlantısı yapılandırılmamış."
      : errorParam === "yetki"
        ? "Bu hesabın menü düzenleme yetkisi yok."
        : null;

  const [state, formAction] = useFormState<LoginState, FormData>(
    adminLoginAction,
    {},
  );

  const message = state.error ?? urlMessage;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <AdminField label="E-posta" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          className={adminInputClass}
        />
      </AdminField>

      <AdminField label="Şifre" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={adminInputClass}
        />
      </AdminField>

      {message ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
