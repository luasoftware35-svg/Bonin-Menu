import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonEnv } from "@/lib/supabase/env";

export function getSupabaseServerClient(): SupabaseClient | null {
  const { url, anonKey: key, configured } = getSupabaseAnonEnv();

  if (!configured) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
