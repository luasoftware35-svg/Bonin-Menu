"use client";

import { motion, useReducedMotion } from "framer-motion";

export function EmptySearchState() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 280, damping: 22 }
      }
      className="rounded-[1.25rem] bg-white/80 px-4 py-5 text-center text-sm text-mute ring-1 ring-black/5"
    >
      <motion.p
        animate={
          reduced
            ? undefined
            : {
                rotate: [0, -1.5, 1.5, -0.5, 0],
              }
        }
        transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
      >
        Aradığın ürün bulunamadı. Kategorilere göz atmayı dene.
      </motion.p>
    </motion.div>
  );
}
