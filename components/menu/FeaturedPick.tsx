"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { fadeUp } from "@/lib/motion";
import { PHOTO_FIT, PHOTO_WELL } from "@/lib/photo";
import { productPhotoLayoutId } from "@/lib/product-photo";
import type { Product } from "@/lib/types";

type FeaturedPickProps = {
  product: Product;
  categoryName: string;
  currency: string;
  locale: string;
  sharedPhoto: boolean;
  onOpen: (product: Product) => void;
};

export function FeaturedPick({
  product,
  categoryName,
  currency,
  locale,
  sharedPhoto,
  onOpen,
}: FeaturedPickProps) {
  const reduced = useReducedMotion();
  const price = formatPrice(product.priceCents, currency, locale);
  const photoLayoutId = sharedPhoto
    ? productPhotoLayoutId(product.id)
    : undefined;

  return (
    <motion.section
      className="px-3 pt-1 sm:px-4"
      aria-label="Günün önerisi"
      {...fadeUp(!!reduced, 0.18)}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="featured-pick-glow group flex w-full items-center gap-3 overflow-hidden rounded-[1.35rem] bg-white p-2.5 text-left ring-1 ring-cocoa/15 transition-transform duration-200 active:scale-[0.995] sm:p-3"
      >
        <span
          className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[1rem] ${PHOTO_WELL} sm:h-20 sm:w-20`}
        >
          {product.imageUrl ? (
            <motion.div
              layoutId={photoLayoutId}
              className="absolute inset-0"
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
            >
              <Image
                src={product.imageUrl}
                alt=""
                fill
                sizes="80px"
                unoptimized
                className={`${PHOTO_FIT} transition-transform duration-200 group-hover:scale-[1.04]`}
              />
            </motion.div>
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-cocoa/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-cocoa">
            Günün önerisi
          </span>
          <span className="mt-1.5 block truncate text-[14px] font-semibold text-ink">
            {product.name}
          </span>
          <span className="mt-0.5 block text-[11px] text-mute">{categoryName}</span>
        </span>
        {price ? (
          <span className="shrink-0 rounded-full bg-cocoa px-3 py-1.5 font-display text-[13px] font-extrabold tabular-nums text-cream">
            {price}
          </span>
        ) : null}
      </button>
    </motion.section>
  );
}
