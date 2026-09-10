export function AdminField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5" htmlFor={htmlFor}>
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint ? (
        <span className="block text-xs text-ink/55">{hint}</span>
      ) : null}
    </label>
  );
}

export const adminInputClass =
  "w-full min-h-12 rounded-xl border border-cocoa/20 bg-white px-4 text-base text-ink shadow-sm outline-none ring-cocoa/30 focus:border-cocoa focus:ring-2";
