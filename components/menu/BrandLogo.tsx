type BrandLogoProps = {
  priority?: boolean;
  className?: string;
};

export function BrandLogo({ priority = false, className = "" }: BrandLogoProps) {
  return (
    // Native img: Next Image optimizer was clipping / softening the wordmark.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-wordmark.png"
      alt="BONİN Bakery & Eatery"
      width={785}
      height={463}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`mx-auto block h-auto w-full max-w-full object-contain object-center ${className}`}
    />
  );
}
