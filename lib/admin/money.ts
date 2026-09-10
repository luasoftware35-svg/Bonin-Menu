/** Fiyatlar veritabanında kuruş (TL × 100) olarak tutulur. */
export function centsToTlInput(cents: number): string {
  if (!Number.isFinite(cents)) return "";
  const tl = cents / 100;
  return Number.isInteger(tl) ? String(tl) : tl.toFixed(2).replace(/\.?0+$/, "");
}

export function tlInputToCents(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const tl = Number.parseFloat(normalized);
  if (!Number.isFinite(tl) || tl < 0) return null;
  return Math.round(tl * 100);
}

export function formatTl(cents: number): string {
  const tl = cents / 100;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: tl % 1 === 0 ? 0 : 2,
  }).format(tl);
}
