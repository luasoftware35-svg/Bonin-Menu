import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/brand/mark-image";

export const contentType = "image/png";

export function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 32, height: 32 },
      id: "small",
    },
    {
      contentType: "image/png",
      size: { width: 512, height: 512 },
      id: "large",
    },
  ];
}

type IconProps = {
  id: Promise<string> | string;
};

export default async function Icon({ id }: IconProps) {
  const resolvedId = await Promise.resolve(id);
  const pixelSize = resolvedId === "large" ? 512 : 32;
  return new ImageResponse(<BrandMark size={pixelSize} />, {
    width: pixelSize,
    height: pixelSize,
  });
}
