"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { allergenText, formatPrice } from "@/lib/format";
import { springSoft } from "@/lib/motion";
import { PHOTO_FIT, PHOTO_WELL } from "@/lib/photo";
import type { Product } from "@/lib/types";

type ProductSheetProps = {
  product: Product | null;
  currency: string;
  locale: string;
  onClose: () => void;
};

const badgeContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.12 },
  },
};

const badgeItem = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 420, damping: 24 },
  },
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
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Kapat"
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
            initial={{ y: 72, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 48, scale: 0.98 }}
            transition={reduced ? { duration: 0 } : springSoft}
            className="relative max-h-[92dvh] w-full max-w-menu overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-cream pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[90dvh] sm:rounded-[1.75rem]"
          >
            <div
              className={`relative aspect-square max-h-[42vh] w-full overflow-hidden ${PHOTO_WELL} sm:max-h-[46vh]`}
            >
              {product.imageUrl ? (
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.06 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="640px"
                    unoptimized
                    className={PHOTO_FIT}
                    priority
                  />
                </motion.div>
              ) : null}
            </div>
            <div className="relative px-4 pt-4 sm:px-5">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" />
              <div className="flex items-start justify-between gap-3">
                <motion.h2
                  id="product-title"
                  initial={reduced ? false : { y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[1.35rem] font-semibold leading-tight sm:text-2xl"
                >
                  {product.name}
                </motion.h2>
                {price ? (
                  <motion.p
                    key={product.id}
                    initial={reduced ? false : { scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 420,
                            damping: 22,
                            delay: 0.08,
                          }
                    }
                    className="shrink-0 font-display text-2xl font-bold tabular-nums text-cocoa"
                  >
                    {price}
                  </motion.p>
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
                <motion.div
                  className="mt-4 flex flex-wrap gap-1.5"
                  variants={badgeContainer}
                  initial="hidden"
                  animate="show"
                >
                  {product.allergens.map((code) => (
                    <motion.span
                      key={code}
                      variants={badgeItem}
                      className="rounded-full bg-cocoa/10 px-2.5 py-1 text-[11px] font-medium text-cocoa"
                    >
                      {allergenText(code)}
                    </motion.span>
                  ))}
                </motion.div>
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
