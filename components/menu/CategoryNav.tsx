"use client";

import Image from "next/image";
import { PHOTO_FIT, PHOTO_WELL } from "@/lib/photo";

export type NavCategory = {
  id: string;
  slug: string;
  name: string;
  cover: string | null;
};

type CategoryNavProps = {
  categories: NavCategory[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function CategoryNav({
  categories,
  activeId,
  onSelect,
}: CategoryNavProps) {
  return (
    <nav
      id="menu"
      aria-label="Kategoriler"
      className="sticky top-0 z-30 border-b border-line/40 bg-cream/95 backdrop-blur-md shadow-[0_8px_24px_-18px_rgba(59,36,22,0.35)]"
    >
      <ul className="mx-auto grid max-w-menu grid-cols-2 gap-1.5 px-3 py-2.5 sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
        {categories.map((category) => {
          const isActive = category.id === activeId;
          return (
            <li key={category.id} className="min-w-0">
              <button
                type="button"
                onClick={() => onSelect(category.id)}
                className={`relative flex min-h-11 w-full items-center gap-1.5 rounded-2xl py-1 pl-1 pr-2 text-left text-[11px] font-medium shadow-sm ring-1 sm:min-h-10 sm:rounded-full sm:pr-2.5 sm:text-[12px] ${
                  isActive
                    ? "bg-cocoa text-cream ring-cocoa"
                    : "bg-white/90 text-ink ring-black/5"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`relative h-7 w-7 shrink-0 overflow-hidden rounded-full ${PHOTO_WELL} sm:h-8 sm:w-8`}
                >
                  {category.cover ? (
                    <Image
                      src={category.cover}
                      alt=""
                      fill
                      sizes="32px"
                      unoptimized
                      className={PHOTO_FIT}
                    />
                  ) : null}
                </span>
                <span className="min-w-0 leading-tight sm:truncate">
                  {category.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
