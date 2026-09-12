/**
 * Supabase anon (public) ayarları — RLS veriyi korur.
 * Vercel Edge bazen .env okumaz; Bonin prod için sabit fallback.
 */
const BONIN_SUPABASE_URL = "https://uawaksxlzewhsgelmuju.supabase.co";
const BONIN_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2Frc3hsemV3aHNnZWxtdWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNTYzMTAsImV4cCI6MjEwNDczMjMxMH0.OwKYqwDOdGyKjBfEcjyup_DWLfGXq-iiJxLyrY7VXWQ";

function pickEnv(name: string, fallback: string) {
  const value = process.env[name]?.trim();
  return value || fallback;
}

export function getSupabaseAnonEnv() {
  const url = pickEnv("NEXT_PUBLIC_SUPABASE_URL", BONIN_SUPABASE_URL);
  const anonKey = pickEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    BONIN_SUPABASE_ANON_KEY,
  );
  return { url, anonKey, configured: Boolean(url && anonKey) };
}
