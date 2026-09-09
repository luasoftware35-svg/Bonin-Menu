"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";
import type { Tenant } from "@/lib/types";

type CompactHeaderProps = {
  tenant: Tenant;
  visible: boolean;
};

export function CompactHeader({ tenant, visible }: CompactHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={false}
      animate={{
        y: visible ? 0 : -64,
        opacity: visible ? 1 : 0,
      }}
      transition={reduced ? { duration: 0 } : { duration: 0.22, ease: easeOut }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 border-b border-line/40 bg-cream/95 backdrop-blur-md"
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-menu items-center justify-center gap-2 px-4 py-2 pt-[max(0.45rem,env(safe-area-inset-top))]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tenant.logoUrl ?? "/brand/logo-wordmark.png"}
          alt=""
          className="h-7 w-auto bg-transparent object-contain"
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cocoa/85">
          {tenant.tagline}
        </span>
      </div>
    </motion.header>
  );
}
