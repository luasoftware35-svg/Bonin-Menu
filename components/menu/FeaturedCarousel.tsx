"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { FeaturedEntry } from "@/lib/featured";
import { fadeUp } from "@/lib/motion";
import { PHOTO_FIT, PHOTO_WELL } from "@/lib/photo";
import { productPhotoLayoutId } from "@/lib/product-photo";
import type { Product } from "@/lib/types";

type FeaturedCarouselProps = {
  items: FeaturedEntry[];
  currency: string;
  locale: string;
  selectedId: string | null;
  photoSource: "featured" | "grid" | null;
  enableSharedPhoto?: boolean;
  onOpen: (product: Product) => void;
};

const ROTATE_MS = 4000;

export function FeaturedCarousel({
  items,
  currency,
  locale,
  selectedId,
  photoSource,
  enableSharedPhoto = false,
  onOpen,
}: FeaturedCarouselProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = items[index];

  useEffect(() => {
    setIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length <= 1 || paused) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!current) return null;

  const price = formatPrice(current.product.priceCents, currency, locale);
  const sharedPhoto =
    enableSharedPhoto &&
    (!selectedId ||
      (selectedId === current.product.id && photoSource === "featured"));
  const photoLayoutId = sharedPhoto
    ? productPhotoLayoutId(current.product.id)
    : undefined;

  return (
    <motion.section
      className="px-3 pt-1 sm:px-4"
      aria-label="Günün önerileri"
      aria-live="polite"
      {...fadeUp(!!reduced, 0.18)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cocoa">
          Günün önerileri
        </p>
        {items.length > 1 ? (
          <p className="text-[10px] tabular-nums text-mute">
            {index + 1} / {items.length}
          </p>
        ) : null}
      </div>

      <div className="grid">
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={current.product.id}
            type="button"
            onClick={() => onOpen(current.product)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="col-start-1 row-start-1 flex w-full items-center gap-3 overflow-hidden rounded-[1.25rem] bg-white p-2.5 text-left ring-1 ring-black/5 transition-transform duration-150 active:scale-[0.99] sm:gap-3.5 sm:p-3"
            style={{
              boxShadow: "0 14px 36px -22px rgba(59,36,22,0.42)",
            }}
          >
            <span
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-[0.9rem] ${PHOTO_WELL} sm:h-[4.5rem] sm:w-[4.5rem]`}
            >
              {current.product.imageUrl ? (
                photoLayoutId ? (
                  <motion.div
                    layoutId={photoLayoutId}
                    className="absolute inset-0"
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={current.product.imageUrl}
                      alt=""
                      fill
                      sizes="72px"
                      className={PHOTO_FIT}
                    />
                  </motion.div>
                ) : (
                  <Image
                    src={current.product.imageUrl}
                    alt=""
                    fill
                    sizes="72px"
                    className={PHOTO_FIT}
                  />
                )
              ) : null}
            </span>

            <span className="min-w-0 flex-1 text-left">
              <span className="inline-flex rounded-full bg-cocoa/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-cocoa">
                Öneri
              </span>
              <span className="mt-1.5 block truncate text-[14px] font-semibold leading-snug text-ink">
                {current.product.name}
              </span>
              <span className="mt-0.5 block text-[11px] text-mute">
                {current.categoryName}
              </span>
            </span>

            {price ? (
              <span className="shrink-0 rounded-full bg-cocoa px-2.5 py-1 font-display text-[12px] font-extrabold tabular-nums leading-none text-cream sm:text-[13px]">
                {price}
              </span>
            ) : null}
          </motion.button>
        </AnimatePresence>
      </div>

      {items.length > 1 ? (
        <div className="mt-2.5 flex items-center justify-center gap-1.5">
          {items.map((item, dotIndex) => (
            <button
              key={item.product.id}
              type="button"
              aria-label={`${item.product.name} önerisini göster`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => setIndex(dotIndex)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                dotIndex === index
                  ? "w-4 bg-cocoa"
                  : "w-1.5 bg-cocoa/20 hover:bg-cocoa/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </motion.section>
  );
}
