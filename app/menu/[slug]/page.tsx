import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuView } from "@/components/menu/MenuView";
import { getMenuBySlug } from "@/lib/menu";

export const revalidate = 60;

type PageProps = {
  params: { slug: string };
};

function menuDescription(menu: NonNullable<Awaited<ReturnType<typeof getMenuBySlug>>>) {
  const parts = [menu.tenant.slogan, menu.tenant.tagline].filter(Boolean);
  return parts.join(" · ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const menu = await getMenuBySlug(params.slug);

  if (!menu) {
    return { title: "Menü bulunamadı" };
  }

  const title = `${menu.tenant.name} · Menü`;
  const description = menuDescription(menu);
  const path = `/menu/${menu.tenant.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: path,
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

export default async function MenuPage({ params }: PageProps) {
  const menu = await getMenuBySlug(params.slug);

  if (!menu) notFound();

  return <MenuView menu={menu} />;
}
