/** Supabase public (anon) credentials — client-safe, RLS ile korunur. */
export function getSupabaseAnonEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return { url, anonKey, configured: Boolean(url && anonKey) };
}
