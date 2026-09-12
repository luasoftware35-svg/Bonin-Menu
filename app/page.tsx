import type { Metadata } from "next";
import { buildMenuMetadata, PublicMenuPage } from "@/lib/menu/public-page";

/** Admin düzenlemeleri hemen görünsün (ISR kapalı). */
export const dynamic = "force-dynamic";

const MENU_SLUG = "bonin";

export async function generateMetadata(): Promise<Metadata> {
  return buildMenuMetadata(MENU_SLUG, { canonicalPath: "/" });
}

export default function Home() {
  return <PublicMenuPage slug={MENU_SLUG} />;
}
