import { Nunito, Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const display = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "BONİN Menü",
  title: {
    default: "BONİN · Menü",
    template: "%s · BONİN",
  },
  description: "BONİN Bakery & Eatery · Günün en güzel anı",
  appleWebApp: {
    capable: true,
    title: "BONİN Menü",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#A04F17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${display.variable} ${sans.variable} font-sans antialiased text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
