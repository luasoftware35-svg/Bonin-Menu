import Link from "next/link";
import { BrandLogo } from "@/components/menu/BrandLogo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#f5eee4] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-center">
      <div className="w-[min(100%,11rem)]">
        <BrandLogo />
      </div>
      <p className="mt-8 font-display text-3xl font-extrabold tracking-wide text-cocoa">
        Sayfa bulunamadı
      </p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">
        Aradığınız menü veya sayfa taşınmış olabilir. Ana menüden devam edebilirsiniz.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-cocoa px-8 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(160,79,23,0.65)] ring-1 ring-cocoa/20 transition hover:bg-cocoa/95"
      >
        Menüye dön
      </Link>
    </main>
  );
}
