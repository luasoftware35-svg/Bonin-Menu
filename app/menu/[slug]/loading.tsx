export default function MenuLoading() {
  return (
    <div className="mx-auto min-h-dvh max-w-menu px-6 py-16">
      <div className="mx-auto h-8 w-28 bg-line/80" />
      <div className="mx-auto mt-6 h-4 w-40 bg-line/60" />
      <div className="mt-20 space-y-10">
        <div className="aspect-[4/5] w-full bg-line/50" />
        <div className="aspect-[4/5] w-full bg-line/40" />
      </div>
    </div>
  );
}
