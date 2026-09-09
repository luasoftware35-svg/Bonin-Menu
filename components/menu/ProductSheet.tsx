"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { allergenText, formatPrice } from "@/lib/format";
import { overlayFade, sheetSlide } from "@/lib/motion";
import { PHOTO_FIT, PHOTO_WELL } from "@/lib/photo";
import type { Product } from "@/lib/types";

type ProductSheetProps = {
  product: Product | null;
  currency: string;
  locale: string;
  onClose: () => void;
};

export function ProductSheet({
  product,
  currency,
  locale,
  onClose,
}: ProductSheetProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!product) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const price = product
    ? formatPrice(product.priceCents, currency, locale)
    : null;

  return (
    <AnimatePresence mode="wait">
      {product ? (
        <motion.div
          key="product-sheet"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : overlayFade}
        >
          <button
            type="button"
            aria-label="Kapat"
            className="absolute inset-0 bg-ink/55"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
            initial={reduced ? false : { y: 28, opacity: 0.98 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: 16, opacity: 0 }}
            transition={reduced ? { duration: 0 } : sheetSlide}
            className="relative max-h-[92dvh] w-full max-w-menu overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-cream pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl will-change-transform sm:max-h-[90dvh] sm:rounded-[1.75rem]"
          >
            <div
              className={`relative aspect-square max-h-[42vh] w-full overflow-hidden ${PHOTO_WELL} sm:max-h-[46vh]`}
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="640px"
                  unoptimized
                  className={PHOTO_FIT}
                  priority
                />
              ) : null}
            </div>
            <div className="relative px-4 pt-4 sm:px-5">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" />
              <div className="flex items-start justify-between gap-3">
                <h2
                  id="product-title"
                  className="text-[1.35rem] font-semibold leading-tight sm:text-2xl"
                >
                  {product.name}
                </h2>
                {price ? (
                  <p className="shrink-0 font-display text-2xl font-bold tabular-nums text-cocoa">
                    {price}
                  </p>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-mute">
                {product.energyKcal != null
                  ? `${product.energyKcal} kcal / ${product.portionNote ?? "porsiyon"}`
                  : null}
              </p>
              {product.ingredientsNote ? (
                <p className="mt-4 text-sm leading-relaxed text-ink/80">
                  {product.ingredientsNote}
                </p>
              ) : null}
              {product.allergens.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.allergens.map((code) => (
                    <span
                      key={code}
                      className="rounded-full bg-cocoa/10 px-2.5 py-1 text-[11px] font-medium text-cocoa"
                    >
                      {allergenText(code)}
                    </span>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-cocoa text-sm font-medium text-cream"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
