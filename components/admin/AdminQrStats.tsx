import type { QrStatsSummary } from "@/lib/admin/load-qr-stats";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cocoa/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-cocoa/65">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-cocoa">
        {value.toLocaleString("tr-TR")}
      </p>
    </div>
  );
}

export default function AdminQrStats({ stats }: { stats: QrStatsSummary }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/65">
          Sadece{" "}
          <span className="font-semibold text-ink">QR kod linki</span> (
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">/q</code>) ile
          gelen açılışlar sayılır. Ay sonu faturalama için aylık toplamlara bakın.
        </p>
        <p className="mt-2 text-xs text-ink/50">
          Her tarama = bir açılış (aynı kişi tekrar okutursa tekrar sayılır).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Bugün" value={stats.today} />
        <StatCard label="Bu ay" value={stats.thisMonth} />
        <StatCard label="Geçen ay" value={stats.lastMonth} />
        <StatCard label="Toplam" value={stats.allTime} />
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cocoa/10">
        <h2 className="font-display text-base font-extrabold text-ink">
          Bu ay günlük
        </h2>
        {stats.dailyThisMonth.length === 0 ? (
          <p className="mt-3 text-sm text-ink/55">Henüz kayıt yok.</p>
        ) : (
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {stats.dailyThisMonth.map((row) => (
              <li
                key={row.day}
                className="flex items-center justify-between border-b border-cocoa/10 pb-2 text-sm last:border-0"
              >
                <span className="text-ink/80">
                  {new Date(`${row.day}T12:00:00Z`).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="font-bold tabular-nums text-cocoa">
                  {row.count.toLocaleString("tr-TR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-cocoa/10">
        <h2 className="font-display text-base font-extrabold text-ink">
          Aylık özet (son 12 ay)
        </h2>
        {stats.monthly.length === 0 ? (
          <p className="mt-3 text-sm text-ink/55">Henüz kayıt yok.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {stats.monthly.map((row) => (
              <li
                key={row.month}
                className="flex items-center justify-between rounded-xl bg-[#f5eee4]/80 px-3 py-2.5 text-sm"
              >
                <span className="font-medium capitalize text-ink">{row.label}</span>
                <span className="font-display text-lg font-extrabold tabular-nums text-cocoa">
                  {row.count.toLocaleString("tr-TR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
