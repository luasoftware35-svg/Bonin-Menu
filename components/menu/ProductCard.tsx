"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { PHOTO_FIT, PHOTO_WELL } from "@/lib/photo";
import { productPhotoLayoutId } from "@/lib/product-photo";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  currency: string;
  locale: string;
  categoryName?: string;
  onOpen: (product: Product) => void;
  layout?: boolean;
  liveFilter?: boolean;
  sharedPhoto?: boolean;
};

export const cardVariants = {
  hidden: { y: 6, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ProductCard({
  product,
  currency,
  locale,
  categoryName,
  onOpen,
  layout = false,
  liveFilter = false,
  sharedPhoto = true,
}: ProductCardProps) {
  const reduced = useReducedMotion();
  const price = formatPrice(product.priceCents, currency, locale);
  const energy =
    product.energyKcal != null
      ? `${product.energyKcal} kcal${product.portionNote ? ` / ${product.portionNote}` : ""}`
      : null;
  const photoLayoutId =
    sharedPhoto && !reduced ? productPhotoLayoutId(product.id) : undefined;

  return (
    <motion.button
      type="button"
      layout={layout ? "position" : false}
      variants={cardVariants}
      initial={liveFilter ? "hidden" : false}
      animate="show"
      exit={liveFilter ? "exit" : undefined}
      onClick={() => onOpen(product)}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.1 }}
      className="group overflow-hidden rounded-[1.25rem] bg-white text-left shadow-[0_14px_36px_-22px_rgba(59,36,22,0.5)] ring-1 ring-black/5 transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(59,36,22,0.55)] active:scale-[0.99]"
    >
      <span
        className={`relative block aspect-square w-full overflow-hidden ${PHOTO_WELL}`}
      >
        {product.imageUrl ? (
          photoLayoutId ? (
            <motion.div
              layoutId={photoLayoutId}
              className="absolute inset-0"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={product.imageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 45vw, 240px"
                className={`${PHOTO_FIT} transition-transform duration-150 group-hover:scale-[1.03] group-active:scale-[1.01]`}
              />
            </motion.div>
          ) : (
            <Image
              src={product.imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 45vw, 240px"
              className={`${PHOTO_FIT} transition-transform duration-150 group-hover:scale-[1.03] group-active:scale-[1.01]`}
            />
          )
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
