import Image from "next/image";
import { isLocalMenuImage } from "@/lib/menu-image";
import { PHOTO_FIT } from "@/lib/photo";

type MenuProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Yerel /menu görselleri native img (BrandLogo gibi); uzak URL Next Image. */
export function MenuProductImage({
  src,
  alt,
  className = PHOTO_FIT,
  sizes,
  priority,
}: MenuProductImageProps) {
  if (isLocalMenuImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
