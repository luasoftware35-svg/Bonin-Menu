import { ALLERGEN_LABELS } from "@/lib/format";
import { instagramHandle } from "@/lib/social";
import type { Tenant } from "@/lib/types";

export function MenuFooter({ tenant }: { tenant: Tenant }) {
  const instagram = tenant.instagram
    ? instagramHandle(tenant.instagram)
    : null;

  return (
    <footer className="mx-3 mb-[max(1.25rem,env(safe-area-inset-bottom))] rounded-[1.5rem] bg-white/75 px-4 py-6 text-[12px] leading-relaxed text-mute shadow-[0_20px_50px_-28px_rgba(59,36,22,0.35)] ring-1 ring-white/80 backdrop-blur-md sm:mx-4 sm:mb-6 sm:px-5 sm:py-7">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-cocoa">
        {tenant.name}
      </p>
      {tenant.tagline ? (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa/80">
          {tenant.tagline}
        </p>
      ) : null}

      <div className="mt-5 space-y-3 border-t border-line/70 pt-5">
        {tenant.address ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa">
              Adres
            </p>
            {tenant.mapsUrl ? (
              <a
                href={tenant.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block whitespace-pre-line text-ink/80"
              >
                {tenant.address}
                <span className="mt-1 block font-medium text-cocoa">
                  Yol tarifi
                </span>
              </a>
            ) : (
              <p className="mt-1 whitespace-pre-line text-ink/80">
                {tenant.address}
              </p>
            )}
          </div>
        ) : null}
        {tenant.hours ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa">
              Çalışma saati
            </p>
            <p className="mt-1 text-ink/80">{tenant.hours}</p>
          </div>
        ) : null}
        {tenant.instagram && instagram ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa">
              Sosyal
            </p>
            <a
              href={tenant.instagram}
              className="mt-1 inline-flex min-h-10 items-center font-medium text-cocoa"
              target="_blank"
              rel="noreferrer"
            >
              Instagram {instagram}
            </a>
          </div>
        ) : null}
      </div>

      <div className="mt-5 border-t border-line/70 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa">
          Ürün güvenliği
        </p>
        <p className="mt-1.5 text-ink/75">
          Menümüzde alkol ve domuz türevi kullanılmaz; tüm ürünler bu ilkeye
          uygun hazırlanır.
        </p>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa">
          Alerjen bilgilendirme
        </p>
        <p className="mt-1.5 text-ink/75">
          {Object.entries(ALLERGEN_LABELS)
            .map(([code, label]) => `${code}: ${label}`)
            .join(" · ")}
        </p>
        <p className="mt-2 text-[11px] text-ink/65">
          * işaretli alerjenler, tarifte belirtilmese dahi ürün yapısı
          gereği bulunabilir.
        </p>
        <p className="mt-4 text-[11px] text-ink/55">
          Menü güncelleme: Eylül 2026
        </p>
      </div>
    </footer>
  );
}
