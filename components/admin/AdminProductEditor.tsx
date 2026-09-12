"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AdminField, adminInputClass } from "@/components/admin/AdminField";
import { centsToTlInput, tlInputToCents } from "@/lib/admin/money";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminProductDetail, AdminTenant } from "@/lib/admin/types";

const MAX_BYTES = 8 * 1024 * 1024;

export default function AdminProductEditor({
  tenant,
  product,
}: {
  tenant: AdminTenant;
  product: AdminProductDetail;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product.name);
  const [priceTl, setPriceTl] = useState(centsToTlInput(product.priceCents));
  const [description, setDescription] = useState(product.description);
  const [energyKcal, setEnergyKcal] = useState(
    product.energyKcal != null ? String(product.energyKcal) : "",
  );
  const [portionNote, setPortionNote] = useState(product.portionNote ?? "");
  const [isAvailable, setIsAvailable] = useState(product.isAvailable);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function uploadImage(file: File) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase yapılandırması yok.");

    if (file.size > MAX_BYTES) {
      throw new Error("Görsel en fazla 8 MB olabilir.");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(ext)
      ? ext
      : "jpg";
    const path = `${tenant.id}/${product.id}/${Date.now()}.${safeExt}`;

    const { error: uploadError } = await supabase.storage
      .from("menu")
      .upload(path, file, { upsert: true, contentType: file.type || undefined });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("menu").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSave() {
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase ayarları eksik.");
      return;
    }

    const priceCents = tlInputToCents(priceTl);
    if (priceCents === null) {
      setMessage("Geçerli bir fiyat girin (ör. 350 veya 349,90).");
      return;
    }

    if (!name.trim()) {
      setMessage("Ürün adı boş olamaz.");
      return;
    }

    setSaving(true);

    const { error: productError } = await supabase
      .from("products")
      .update({
        price_cents: priceCents,
        image_url: imageUrl,
        portion_note: portionNote.trim() || null,
        is_available: isAvailable,
      })
      .eq("id", product.id)
      .eq("tenant_id", tenant.id);

    if (productError) {
      setSaving(false);
      setMessage(productError.message);
      return;
    }

    const { error: trError } = await supabase.from("product_translations").upsert(
      {
        product_id: product.id,
        locale: tenant.defaultLocale,
        name: name.trim(),
        description: description.trim() || null,
      },
      { onConflict: "product_id,locale" },
    );

    setSaving(false);

    if (trError) {
      setMessage(trError.message);
      return;
    }

    setMessage("Kaydedildi.");
    router.refresh();
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setMessage(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      setMessage("Görsel yüklendi. Kaydet’e basmayı unutmayın.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5 pb-24">
      <Link
        href="/admin/menu"
        className="inline-flex min-h-10 items-center text-sm font-semibold text-cocoa"
      >
        ← Ürün listesi
      </Link>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#ebe3d9] ring-1 ring-cocoa/10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-ink/45">
            <span className="text-4xl" aria-hidden>
              📷
            </span>
            <p className="text-sm font-medium">Henüz fotoğraf yok</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => void onPickFile(e)}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-dashed border-cocoa/35 bg-white text-base font-bold text-cocoa disabled:opacity-60"
      >
        {uploading ? "Yükleniyor…" : "Kameradan / galeriden fotoğraf seç"}
      </button>

      <AdminField label="Ürün adı" htmlFor="name">
        <input
          id="name"
          className={adminInputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </AdminField>

      <AdminField label="Fiyat (₺)" htmlFor="price" hint="Kuruş için virgül veya nokta kullanabilirsiniz.">
        <input
          id="price"
          inputMode="decimal"
          className={adminInputClass}
          value={priceTl}
          onChange={(e) => setPriceTl(e.target.value)}
        />
      </AdminField>

      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Kalori (kcal)" htmlFor="kcal" hint="Menüde gösterilir. Özel değer için Supabase kalori sütunu aktif olmalı.">
          <input
            id="kcal"
            inputMode="numeric"
            className={adminInputClass}
            value={energyKcal}
            onChange={(e) => setEnergyKcal(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="390"
          />
        </AdminField>
        <AdminField label="Porsiyon" htmlFor="portion" hint="Örn. adet, dilim">
          <input
            id="portion"
            className={adminInputClass}
            value={portionNote}
            onChange={(e) => setPortionNote(e.target.value)}
            placeholder="adet"
          />
        </AdminField>
      </div>

      <AdminField label="Açıklama" htmlFor="desc">
        <textarea
          id="desc"
          rows={4}
          className={`${adminInputClass} min-h-[6rem] resize-y py-3`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </AdminField>

      <label className="flex min-h-12 cursor-pointer items-center justify-between rounded-xl bg-white px-4 ring-1 ring-cocoa/15">
        <span className="font-semibold text-ink">Menüde görünsün</span>
        <input
          type="checkbox"
          className="h-6 w-6 accent-[#a04f17]"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
      </label>

      {message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            message.includes("Kaydedildi") || message.includes("yüklendi")
              ? "bg-emerald-50 text-emerald-900"
              : "bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cocoa/15 bg-[#faf6f0]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            disabled={saving || uploading}
            onClick={() => void onSave()}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-cocoa font-display text-base font-extrabold text-white shadow-lg disabled:opacity-60"
          >
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
