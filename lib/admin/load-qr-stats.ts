import type { SupabaseClient } from "@supabase/supabase-js";

export type QrDailyRow = {
  day: string;
  count: number;
};

export type QrMonthRow = {
  month: string;
  label: string;
  count: number;
};

export type QrStatsSummary = {
  today: number;
  thisMonth: number;
  lastMonth: number;
  allTime: number;
  dailyThisMonth: QrDailyRow[];
  monthly: QrMonthRow[];
};

const trMonth = new Intl.DateTimeFormat("tr-TR", {
  month: "long",
  year: "numeric",
});

function startOfMonth(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function addMonths(d: Date, delta: number) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1));
}

function toDayKey(iso: string) {
  return iso.slice(0, 10);
}

export async function loadQrStats(
  supabase: SupabaseClient,
  tenantId: string,
): Promise<QrStatsSummary> {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = addMonths(thisMonthStart, -1);
  const twelveMonthsStart = addMonths(thisMonthStart, -11);

  const { data: rows, error } = await supabase
    .from("qr_scan_events")
    .select("scanned_at")
    .eq("tenant_id", tenantId)
    .gte("scanned_at", twelveMonthsStart.toISOString())
    .order("scanned_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const { count: allTime, error: countError } = await supabase
    .from("qr_scan_events")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  if (countError) {
    throw new Error(countError.message);
  }

  const events = rows ?? [];
  const todayKey = toDayKey(now.toISOString());
  const thisMonthKey = `${thisMonthStart.getUTCFullYear()}-${String(thisMonthStart.getUTCMonth() + 1).padStart(2, "0")}`;
  const lastMonthKey = `${lastMonthStart.getUTCFullYear()}-${String(lastMonthStart.getUTCMonth() + 1).padStart(2, "0")}`;

  let today = 0;
  let thisMonth = 0;
  let lastMonth = 0;

  const dailyMap = new Map<string, number>();
  const monthlyMap = new Map<string, number>();

  for (const row of events) {
    const day = toDayKey(row.scanned_at);
    const month = day.slice(0, 7);

    if (day === todayKey) today += 1;
    if (month === thisMonthKey) {
      thisMonth += 1;
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
    }
    if (month === lastMonthKey) lastMonth += 1;
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + 1);
  }

  const dailyThisMonth = Array.from(dailyMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([day, count]) => ({ day, count }));

  const monthly = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, count]) => {
      const [y, m] = month.split("-").map(Number);
      const label = trMonth.format(new Date(Date.UTC(y, m - 1, 1)));
      return { month, label, count };
    });

  return {
    today,
    thisMonth,
    lastMonth,
    allTime: allTime ?? 0,
    dailyThisMonth,
    monthly,
  };
}
