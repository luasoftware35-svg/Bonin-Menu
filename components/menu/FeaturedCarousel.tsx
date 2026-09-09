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

const ROTATE_MS = 3800;

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
      <div className="mb-2 flex items-center justify-between px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cocoa">
          Günün önerileri
        </p>
        <p className="text-[10px] tabular-nums text-mute">
          {index + 1}/{items.length}
        </p>
      </div>

      <div className="relative min-h-[5.25rem] overflow-hidden sm:min-h-[5.75rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={current.product.id}
            type="button"
            onClick={() => onOpen(current.product)}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="group absolute inset-x-0 top-0 flex w-full items-center gap-3 overflow-hidden rounded-[1.35rem] bg-white p-2.5 text-left shadow-[0_12px_32px_-20px_rgba(59,36,22,0.45)] ring-1 ring-black/5 transition-transform duration-200 active:scale-[0.995] sm:p-3"
          >
            <span
              className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[1rem] ${PHOTO_WELL} sm:h-20 sm:w-20`}
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
                      sizes="80px"
                      className={`${PHOTO_FIT} transition-transform duration-150 group-hover:scale-[1.04]`}
                    />
                  </motion.div>
                ) : (
                  <Image
                    src={current.product.imageUrl}
                    alt=""
                    fill
                    sizes="80px"
                    className={`${PHOTO_FIT} transition-transform duration-150 group-hover:scale-[1.04]`}
                  />
                )
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold text-ink">
                {current.product.name}
              </span>
              <span className="mt-0.5 block text-[11px] text-mute">
                {current.categoryName}
              </span>
            </span>
            {price ? (
              <span className="shrink-0 rounded-full bg-cocoa px-3 py-1.5 font-display text-[13px] font-extrabold tabular-nums text-cream">
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
                  ? "w-5 bg-cocoa"
                  : "w-1.5 bg-cocoa/25 hover:bg-cocoa/45"
              }`}
            />
          ))}
        </div>
      ) : null}
    </motion.section>
  );
}
