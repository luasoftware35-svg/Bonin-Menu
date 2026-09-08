"use client";

type MenuSearchProps = {
  value: string;
  onChange: (value: string) => void;
  resultCount: number | null;
};

export function MenuSearch({ value, onChange, resultCount }: MenuSearchProps) {
  return (
    <div className="px-3 sm:px-4">
      <label className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-mute">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ürün ara… magnolya, pizza, sandviç"
          enterKeyHint="search"
          className="w-full rounded-full bg-white/95 py-2.5 pl-10 pr-10 text-[13px] text-ink shadow-sm ring-1 ring-black/5 placeholder:text-mute/80 focus:outline-none focus:ring-2 focus:ring-cocoa/35"
        />
        {value ? (
          <button
            type="button"
            aria-label="Aramayı temizle"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-2 flex w-9 items-center justify-center rounded-full text-mute transition hover:text-cocoa"
          >
            <ClearIcon />
          </button>
        ) : null}
      </label>
      {resultCount != null ? (
        <p className="mt-2 px-1 text-[11px] text-mute">
          {resultCount > 0
            ? `${resultCount} sonuç bulundu`
            : "Sonuç bulunamadı — farklı bir kelime dene"}
        </p>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
