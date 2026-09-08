"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { PHOTO_FIT, PHOTO_WELL } from "@/lib/photo";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  currency: string;
  locale: string;
  categoryName?: string;
  onOpen: (product: Product) => void;
};

export const cardVariants = {
  hidden: { y: 12 },
  show: {
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 28 },
  },
};

export function ProductCard({
  product,
  currency,
  locale,
  categoryName,
  onOpen,
}: ProductCardProps) {
  const price = formatPrice(product.priceCents, currency, locale);
  const energy =
    product.energyKcal != null ? `${product.energyKcal} kcal` : null;

  return (
    <motion.button
      type="button"
      variants={cardVariants}
      onClick={() => onOpen(product)}
      whileTap={{ scale: 0.985 }}
      className="group overflow-hidden rounded-[1.25rem] bg-white text-left shadow-[0_14px_36px_-22px_rgba(59,36,22,0.5)] ring-1 ring-black/5"
    >
      <span
        className={`relative block aspect-square w-full overflow-hidden ${PHOTO_WELL}`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="50vw"
            unoptimized
            className={PHOTO_FIT}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-4xl font-bold text-cocoa/30">
            {product.name.slice(0, 1)}
          </span>
        )}
      </span>
      <span className="flex items-start justify-between gap-2 px-2.5 py-2.5 sm:px-3 sm:py-3">
        <span className="min-w-0">
          {categoryName ? (
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-cocoa/75">
              {categoryName}
            </span>
          ) : null}
          <span className="block text-[13px] font-semibold leading-snug text-ink">
            {product.name}
          </span>
          {energy ? (
            <span className="mt-0.5 block text-[11px] tabular-nums text-mute">
              {energy}
            </span>
          ) : null}
        </span>
        {price ? (
          <span className="shrink-0 rounded-full bg-cocoa px-2.5 py-1 font-display text-[12px] font-extrabold tabular-nums leading-none text-cream sm:text-[13px]">
            {price}
          </span>
        ) : null}
      </span>
    </motion.button>
  );
}
