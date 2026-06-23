import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { HomePromoFloatingEntry } from "@/components/HomePromoFloatingEntry";
import { siteDescription, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }]
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <SiteChrome>{children}</SiteChrome>
        <HomePromoFloatingEntry />
      </body>
    </html>
  );
}
