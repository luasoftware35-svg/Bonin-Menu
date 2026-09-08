export function formatPrice(
  cents: number | null,
  currency: string,
  locale: string,
) {
  if (cents == null) return null;
  if (locale === "tr" && currency === "TRY") {
    return `${Math.round(cents / 100)} ₺`;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const ALLERGEN_LABELS: Record<string, string> = {
  G: "Gluten",
  S: "Süt",
  Y: "Yumurta",
  F: "Kuruyemiş",
  B: "Balık",
  Su: "Susam",
  So: "Soya",
  J: "Jelatin",
};

export function allergenText(code: string) {
  const star = code.endsWith("*");
  const key = star ? code.slice(0, -1) : code;
  const label = ALLERGEN_LABELS[key] ?? key;
  return star ? `${label}*` : label;
}
