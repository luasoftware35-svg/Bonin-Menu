"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatTl } from "@/lib/admin/money";
import type { AdminCategory, AdminProductListItem, AdminTenant } from "@/lib/admin/types";

export default function AdminMenuClient({
  tenant,
  categories,
  products,
}: {
  tenant: AdminTenant;
  categories: AdminCategory[];
  products: AdminProductListItem[];
}) {
  const [categoryId, setCategoryId] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return products.filter((p) => {
      if (q) return p.name.toLocaleLowerCase("tr").includes(q);
      if (categoryId && p.categoryId !== categoryId) return false;
      return true;
    });
  }, [products, categoryId, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink/65">
          {products.length} ürün · değişiklikler anında menüde görünür
        </p>
        <Link
          href={`/menu/${tenant.slug}`}
          className="shrink-0 text-sm font-semibold text-cocoa underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Menüyü aç
        </Link>
      </div>

      <input
        type="search"
        placeholder="Ürün ara…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-h-12 w-full rounded-xl border border-cocoa/20 bg-white px-4 text-base shadow-sm outline-none focus:border-cocoa focus:ring-2 focus:ring-cocoa/30"
      />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setCategoryId("")}
          className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
            categoryId === ""
              ? "bg-cocoa text-white"
              : "bg-white text-ink/70 ring-1 ring-cocoa/15"
          }`}
        >
          Tümü
        </button>
        {categories.map((cat) => {
          const active = cat.id === categoryId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? "bg-cocoa text-white"
                  : "bg-white text-ink/70 ring-1 ring-cocoa/15"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <ul className="space-y-2">
        {filtered.map((product) => (
          <li key={product.id}>
            <Link
              href={`/admin/menu/${product.id}`}
              className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-cocoa/10 active:scale-[0.99]"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#ebe3d9]">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-ink/40">
                    Foto yok
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{product.name}</p>
                <p className="text-sm font-bold text-cocoa">
                  {formatTl(product.priceCents)}
                </p>
              </div>
              {!product.isAvailable ? (
                <span className="rounded-full bg-ink/10 px-2 py-1 text-xs font-bold text-ink/60">
                  Gizli
                </span>
              ) : null}
              <span className="text-cocoa/40" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink/55">
          Bu kategoride ürün yok veya arama sonucu bulunamadı.
        </p>
      ) : null}
    </div>
  );
}
