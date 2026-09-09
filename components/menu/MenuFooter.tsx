import { ALLERGEN_LABELS } from "@/lib/format";
import { instagramHandle } from "@/lib/social";
import type { Tenant } from "@/lib/types";
import { FooterAccordion } from "@/components/menu/FooterAccordion";

export function MenuFooter({ tenant }: { tenant: Tenant }) {
  const instagram = tenant.instagram
    ? instagramHandle(tenant.instagram)
    : null;

  return (
    <footer className="mx-3 mb-[max(1.25rem,env(safe-area-inset-bottom))] rounded-[1.5rem] bg-white/90 px-4 py-6 text-[12px] leading-relaxed text-mute shadow-[0_20px_50px_-28px_rgba(59,36,22,0.35)] ring-1 ring-white/80 sm:mx-4 sm:mb-6 sm:px-5 sm:py-7">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-cocoa">
        {tenant.name}
      </p>
      {tenant.tagline ? (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cocoa/80">
          {tenant.tagline}
        </p>
      ) : null}

      <div className="mt-5 border-t border-line/70 pt-1">
        {tenant.address ? (
          <FooterAccordion title="Adres">
            {tenant.mapsUrl ? (
              <a
                href={tenant.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="block whitespace-pre-line text-ink/80"
              >
                {tenant.address}
                <span className="mt-2 inline-flex min-h-10 items-center font-medium text-cocoa">
                  Yol tarifi al →
                </span>
              </a>
            ) : (
              <p className="whitespace-pre-line text-ink/80">{tenant.address}</p>
            )}
          </FooterAccordion>
        ) : null}

        {tenant.hours ? (
          <FooterAccordion title="Çalışma saati">
            <p className="text-ink/80">{tenant.hours}</p>
          </FooterAccordion>
        ) : null}

        {tenant.instagram && instagram ? (
          <FooterAccordion title="BONİN Instagram">
            <a
              href={tenant.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 flex-col justify-center font-medium text-cocoa"
            >
              <span className="text-[13px] font-semibold">{instagram}</span>
              <span className="mt-0.5 text-[11px] text-mute">
                Instagram&apos;da bizi takip et →
              </span>
            </a>
          </FooterAccordion>
        ) : null}

        <FooterAccordion title="Ürün güvenliği">
          <p className="text-ink/75">
            Menümüzde alkol ve domuz türevi kullanılmaz; tüm ürünler bu ilkeye
            uygun hazırlanır.
          </p>
        </FooterAccordion>

        <FooterAccordion title="Alerjen bilgilendirme">
          <p className="text-ink/75">
            {Object.entries(ALLERGEN_LABELS)
              .map(([code, label]) => `${code}: ${label}`)
              .join(" · ")}
          </p>
          <p className="mt-2 text-[11px] text-ink/65">
            * işaretli alerjenler, tarifte belirtilmese dahi ürün yapısı
            gereği bulunabilir.
          </p>
        </FooterAccordion>
      </div>

      <p className="mt-4 border-t border-line/70 pt-4 text-center text-[11px] text-ink/55">
        Menü güncelleme: Eylül 2026
      </p>
    </footer>
  );
}
