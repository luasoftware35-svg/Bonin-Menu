"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminField, adminInputClass } from "@/components/admin/AdminField";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminTenant } from "@/lib/admin/types";

export type TenantSettings = {
  tagline: string;
  slogan: string;
  instagram: string;
  hours: string;
  address: string;
};

export default function AdminSettingsForm({
  tenant,
  initial,
}: {
  tenant: AdminTenant;
  initial: TenantSettings;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function setField<K extends keyof TenantSettings>(key: K, value: TenantSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase ayarları eksik.");
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("tenants")
      .update({
        tagline: form.tagline.trim() || null,
        slogan: form.slogan.trim() || null,
        instagram: form.instagram.trim() || null,
        hours: form.hours.trim() || null,
        address: form.address.trim() || null,
      })
      .eq("id", tenant.id);

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Ayarlar kaydedildi.");
    router.refresh();
  }

  return (
    <div className="space-y-5 pb-8">
      <p className="text-sm text-ink/65">
        İşletme bilgileri menü sayfasının üst ve alt kısımlarında görünür.
      </p>

      <AdminField label="Alt başlık (tagline)" htmlFor="tagline">
        <input
          id="tagline"
          className={adminInputClass}
          value={form.tagline}
          onChange={(e) => setField("tagline", e.target.value)}
        />
      </AdminField>

      <AdminField label="Slogan" htmlFor="slogan">
        <input
          id="slogan"
          className={adminInputClass}
          value={form.slogan}
          onChange={(e) => setField("slogan", e.target.value)}
        />
      </AdminField>

      <AdminField label="Instagram kullanıcı veya link" htmlFor="instagram">
        <input
          id="instagram"
          inputMode="url"
          className={adminInputClass}
          placeholder="bonin.tr veya tam URL"
          value={form.instagram}
          onChange={(e) => setField("instagram", e.target.value)}
        />
      </AdminField>

      <AdminField label="Adres" htmlFor="address">
        <textarea
          id="address"
          rows={2}
          className={`${adminInputClass} py-3`}
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
        />
      </AdminField>

      <AdminField label="Çalışma saatleri" htmlFor="hours">
        <textarea
          id="hours"
          rows={3}
          className={`${adminInputClass} py-3`}
          value={form.hours}
          onChange={(e) => setField("hours", e.target.value)}
        />
      </AdminField>

      {message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            message.includes("kaydedildi")
              ? "bg-emerald-50 text-emerald-900"
              : "bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <button
        type="button"
        disabled={saving}
        onClick={() => void onSave()}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-cocoa font-display text-base font-extrabold text-white shadow-md disabled:opacity-60"
      >
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </div>
  );
}
