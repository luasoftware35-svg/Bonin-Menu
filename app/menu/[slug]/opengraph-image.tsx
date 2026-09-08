import { ImageResponse } from "next/og";
import { boninMenu } from "@/lib/seed/bonin";

export const runtime = "edge";
export const alt = "BONİN dijital menü";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: { slug: string };
};

export default async function OpenGraphImage({ params }: Props) {
  const menu = params.slug === boninMenu.tenant.slug ? boninMenu : null;
  const name = menu?.tenant.name ?? "BONİN";
  const tagline = menu?.tenant.tagline ?? "Bakery & Eatery";
  const slogan = menu?.tenant.slogan ?? "Günün en güzel anı";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5EEE4",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 15%, rgba(160,79,23,0.16), transparent 42%), radial-gradient(circle at 85% 80%, rgba(210,129,65,0.14), transparent 40%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 112,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#A04F17",
              lineHeight: 1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#A04F17",
            }}
          >
            {tagline}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              fontWeight: 600,
              color: "#3B2416",
            }}
          >
            {slogan}
          </div>
          <div
            style={{
              marginTop: 36,
              borderRadius: 999,
              background: "#A04F17",
              color: "#F5EEE4",
              padding: "14px 32px",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Dijital Menü
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
