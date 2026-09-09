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
  onOpen: (product: Product) => void;
};

const ROTATE_MS = 4500;

export function FeaturedCarousel({
  items,
  currency,
  locale,
  selectedId,
  photoSource,
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
    if (reduced || items.length <= 1 || paused) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [items.length, paused, reduced]);

  if (!current) return null;

  const price = formatPrice(current.product.priceCents, currency, locale);
  const sharedPhoto =
    !selectedId ||
    (selectedId === current.product.id && photoSource === "featured");
  const photoLayoutId = sharedPhoto
    ? productPhotoLayoutId(current.product.id)
    : undefined;

  return (
    <motion.section
      className="px-3 pt-1 sm:px-4"
      aria-label="Günün önerileri"
      {...fadeUp(!!reduced, 0.18)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="mb-2 flex items-center justify-between px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cocoa">
          Günün önerileri
        </p>
        <p className="text-[10px] tabular-nums text-mute">
          {index + 1}/{items.length}
        </p>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={current.product.id}
            type="button"
            onClick={() => onOpen(current.product)}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="featured-pick-glow group flex w-full items-center gap-3 overflow-hidden rounded-[1.35rem] bg-white p-2.5 text-left ring-1 ring-cocoa/15 transition-transform duration-200 active:scale-[0.995] sm:p-3"
          >
            <span
              className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[1rem] ${PHOTO_WELL} sm:h-20 sm:w-20`}
            >
              {current.product.imageUrl ? (
                <motion.div
                  layoutId={photoLayoutId}
                  className="absolute inset-0"
                  transition={{ type: "spring", stiffness: 340, damping: 32 }}
                >
                  <Image
                    src={current.product.imageUrl}
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
              <span className="mt-1.5 block truncate text-[14px] font-semibold text-ink">
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
