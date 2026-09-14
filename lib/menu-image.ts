/** Yerel /menu görselleri — Next optimizer bazen Vercel'de boş döner; doğrudan servis et. */
export function isLocalMenuImage(src: string | null | undefined): src is string {
  return Boolean(src?.startsWith("/menu/") || src?.startsWith("/brand/"));
}
