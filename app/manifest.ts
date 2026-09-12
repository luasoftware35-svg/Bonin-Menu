import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const base = getSiteUrl();

  return {
    name: "BONİN · Dijital Menü",
    short_name: "BONİN",
    description: "BONİN Bakery & Eatery · Günün en güzel anı",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5EEE4",
    theme_color: "#A04F17",
    lang: "tr",
    orientation: "portrait",
    icons: [
      {
        src: "/icon/small",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon/large",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    id: `${base}/`,
  };
}
