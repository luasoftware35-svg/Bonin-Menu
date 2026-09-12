import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuView } from "@/components/menu/MenuView";
import { getMenuBySlug } from "@/lib/menu";

function menuDescription(menu: NonNullable<Awaited<ReturnType<typeof getMenuBySlug>>>) {
  const parts = [menu.tenant.slogan, menu.tenant.tagline].filter(Boolean);
  return parts.join(" · ");
}

type MenuMetadataOptions = {
  /** Open Graph / canonical path (e.g. `/` or `/menu/bonin`). */
  canonicalPath: string;
};

export async function buildMenuMetadata(
  slug: string,
  { canonicalPath }: MenuMetadataOptions,
): Promise<Metadata> {
  const menu = await getMenuBySlug(slug);

  if (!menu) {
    return { title: "Menü bulunamadı" };
  }

  const title = `${menu.tenant.name} · Menü`;
  const description = menuDescription(menu);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: menu.tenant.name,
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function PublicMenuPage({ slug }: { slug: string }) {
  const menu = await getMenuBySlug(slug);

  if (!menu) notFound();

  return <MenuView menu={menu} />;
}
