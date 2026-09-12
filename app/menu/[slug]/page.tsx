import type { Metadata } from "next";
import { buildMenuMetadata, PublicMenuPage } from "@/lib/menu/public-page";

/** Admin düzenlemeleri hemen görünsün (ISR kapalı). */
export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return buildMenuMetadata(params.slug, {
    canonicalPath: `/menu/${params.slug}`,
  });
}

export default function MenuPage({ params }: PageProps) {
  return <PublicMenuPage slug={params.slug} />;
}
