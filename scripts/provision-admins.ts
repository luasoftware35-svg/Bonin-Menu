/**
 * Supabase Auth kullanıcısı oluşturur + tenant_admins bağlar.
 * Şifreleri dosyaya yazmayın; ortam değişkeni ile verin:
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... TENANT_ID=... \
 *   ADMIN1_EMAIL=... ADMIN1_PASSWORD=... \
 *   ADMIN2_EMAIL=... ADMIN2_PASSWORD=... \
 *   npx tsx scripts/provision-admins.ts
 */

import { createClient } from "@supabase/supabase-js";

const url =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const tenantId = process.env.TENANT_ID ?? "";

type Pair = { email: string; password: string };

function pair(n: 1 | 2): Pair | null {
  const email = process.env[`ADMIN${n}_EMAIL`];
  const password = process.env[`ADMIN${n}_PASSWORD`];
  if (!email || !password) return null;
  return { email, password };
}

async function ensureUser(
  supabase: ReturnType<typeof createClient>,
  { email, password }: Pair,
) {
  const { data: listed, error: listError } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;

  const existing = listed.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (existing) {
    console.log("Zaten var:", email, existing.id);
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log("Oluşturuldu:", email, data.user.id);
  return data.user.id;
}

async function linkAdmin(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const { error } = await supabase.from("tenant_admins").upsert(
    { tenant_id: tenantId, user_id: userId },
    { onConflict: "tenant_id,user_id" },
  );
  if (error) throw error;
}

async function main() {
  if (!url || !serviceKey || !tenantId) {
    console.error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TENANT_ID gerekli.");
    process.exit(1);
  }

  const accounts = [pair(1), pair(2)].filter(Boolean) as Pair[];
  if (accounts.length === 0) {
    console.error("En az ADMIN1_EMAIL + ADMIN1_PASSWORD gerekli.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const account of accounts) {
    const userId = await ensureUser(supabase, account);
    await linkAdmin(supabase, userId);
    console.log("  → tenant_admins OK");
  }

  console.log("\nAdmin giriş: /admin/login");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
