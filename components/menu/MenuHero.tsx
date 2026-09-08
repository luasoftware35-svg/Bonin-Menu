"use client";

import { BrandLogo } from "@/components/menu/BrandLogo";
import type { Tenant } from "@/lib/types";

export function MenuHero({ tenant }: { tenant: Tenant; ticker?: string[] }) {
  return (
    <header className="relative px-5 pb-4 pt-[max(0.9rem,env(safe-area-inset-top))] text-center sm:px-6 sm:pb-5 sm:pt-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-36 max-w-xs bg-[radial-gradient(ellipse_at_center,rgba(160,79,23,0.12),transparent_70%)]"
      />
      <div className="relative mx-auto w-[8.5rem] sm:w-[9.75rem]">
        <BrandLogo priority />
      </div>
      {tenant.tagline ? (
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cocoa">
          {tenant.tagline}
        </p>
      ) : null}
      {tenant.slogan ? (
        <p className="mt-1.5 font-display text-[15px] font-medium leading-snug text-ink sm:text-base">
          {tenant.slogan}
        </p>
      ) : null}
      <div
        aria-hidden
        className="mx-auto mt-4 h-px w-10 bg-cocoa/25 sm:mt-5 sm:w-12"
      />
      <h1 className="sr-only">
        {tenant.name} {tenant.tagline}
      </h1>
    </header>
  );
}
