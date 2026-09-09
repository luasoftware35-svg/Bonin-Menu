"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/menu/BrandLogo";
import { fadeUp } from "@/lib/motion";
import { instagramHandle } from "@/lib/social";
import type { Tenant } from "@/lib/types";

type MenuHeroProps = {
  tenant: Tenant;
  ticker?: string[];
  scrollProgress?: number;
};

export function MenuHero({
  tenant,
  ticker = [],
  scrollProgress = 0,
}: MenuHeroProps) {
  const reduced = useReducedMotion();
  const tickerItems = ticker.length > 0 ? [...ticker, ...ticker] : [];
  const logoScale = 1 - scrollProgress * 0.22;
  const logoOpacity = 1 - scrollProgress * 0.35;

  return (
    <header className="relative px-5 pb-4 pt-[max(0.9rem,env(safe-area-inset-top))] text-center sm:px-6 sm:pb-5 sm:pt-5">
      <motion.div
        className="relative mx-auto w-[8.5rem] sm:w-[9.75rem]"
        initial={
          reduced
            ? false
            : { opacity: 0, y: 16, scale: 0.94 }
        }
        animate={{
          opacity: logoOpacity,
          y: 0,
          scale: reduced ? 1 : logoScale,
        }}
        transition={
          reduced
            ? { duration: 0 }
            : scrollProgress > 0
              ? { duration: 0.12, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <BrandLogo priority />
      </motion.div>
      {tenant.tagline ? (
        <motion.p
          className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa"
          style={{ opacity: 1 - scrollProgress * 0.5 }}
          {...fadeUp(!!reduced, 0.08)}
        >
          {tenant.tagline}
        </motion.p>
      ) : null}
      {tenant.slogan ? (
        <motion.p
          className="mt-1.5 font-display text-[15px] font-medium leading-snug text-ink sm:text-base"
          style={{ opacity: 1 - scrollProgress * 0.45 }}
          {...fadeUp(!!reduced, 0.14)}
        >
          {tenant.slogan}
        </motion.p>
      ) : null}
      {tickerItems.length > 0 ? (
        <motion.div
          className="marquee mt-3 sm:mt-4"
          aria-hidden
          style={{ opacity: 1 - scrollProgress * 0.4 }}
          {...fadeUp(!!reduced, 0.2)}
        >
          <div className="marquee-track text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa/55">
            {tickerItems.map((name, index) => (
              <span key={`${name}-${index}`}>{name}</span>
            ))}
          </div>
        </motion.div>
      ) : null}
      <motion.div
        aria-hidden
        className="mx-auto mt-4 h-px w-10 bg-cocoa/25 sm:mt-5 sm:w-12"
        style={{ opacity: 1 - scrollProgress * 0.5 }}
        {...fadeUp(!!reduced, 0.22)}
      />
      {tenant.instagram ? (
        <motion.a
          href={tenant.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-10 items-center justify-center text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoa/90 transition hover:text-cocoa"
          style={{ opacity: 1 - scrollProgress * 0.35 }}
          {...fadeUp(!!reduced, 0.26)}
        >
          {instagramHandle(tenant.instagram)}
        </motion.a>
      ) : null}
      <h1 className="sr-only">
        {tenant.name} {tenant.tagline}
      </h1>
    </header>
  );
}
