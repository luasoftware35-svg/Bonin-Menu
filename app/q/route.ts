import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** QR kod bu adrese gelir; tarama kaydedilir ve menüye yönlendirilir. */
export async function GET(request: Request) {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    await supabase.rpc("record_qr_scan", { p_slug: "bonin" });
  }

  const url = new URL("/", request.url);
  return NextResponse.redirect(url, 302);
}
