import { ImageResponse } from "next/og";
import { MenuOgImage, menuOgImageSize } from "@/lib/brand/menu-og-image";
import { getMenuBySlug } from "@/lib/menu";

export const alt = "BONİN dijital menü";
export const size = menuOgImageSize;
export const contentType = "image/png";

export default async function TwitterImage() {
  const menu = await getMenuBySlug("bonin");
  const name = menu?.tenant.name ?? "BONİN";
  const tagline = menu?.tenant.tagline ?? "Bakery & Eatery";
  const slogan = menu?.tenant.slogan ?? "Günün en güzel anı";

  return new ImageResponse(
    <MenuOgImage name={name} tagline={tagline} slogan={slogan} />,
    { ...menuOgImageSize },
  );
}
