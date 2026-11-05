import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "../providers";
import CartProvider from "@/providers/CartProvider";
import { absoluteSiteUrl, siteOrigin } from "@/lib/seo";
import { publicIndexingEnabled } from "@/lib/indexing";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  alternates: { canonical: "/" },
  title: {
    default: "Retevis Mongolia | Холбооны станц, радио хэрэгсэл",
    template: `%s | Retevis Mongolia`,
  },
  description: "Монголын холбооны радио станц, дагалдах хэрэгслийн төрөлжсөн дэлгүүр.",
  icons: "/Retevis/RMlogo.png",
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "Retevis Mongolia",
    title: "Retevis | Станцын төрөлжсөн дэлгүүр",
    description: "Монголын холбооны радио станц, дагалдах хэрэгслийн төрөлжсөн дэлгүүр.",
    images: [{ url: absoluteSiteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Retevis Mongolia-ийн холбооны станц, радио хэрэгслийн каталог" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retevis | Станцын төрөлжсөн дэлгүүр",
    description: "Монголын холбооны радио станц, дагалдах хэрэгслийн төрөлжсөн дэлгүүр.",
    images: [absoluteSiteUrl("/opengraph-image")],
  },
  robots: {
    index: publicIndexingEnabled,
    follow: publicIndexingEnabled,
    googleBot: { index: publicIndexingEnabled, follow: publicIndexingEnabled, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="overflow-x-clip">
      <head>
        <meta
          name="google-site-verification"
          content="nWxsj2YVieYZPW8U8CXGojl4mRk5ii9knhDp4KWZiNc"
        />
      </head>
      <body className="bg-gray/[2%] overflow-x-clip">
        <CartProvider>
          <Providers>
            <main className="mx-auto w-full max-w-screen overflow-x-clip">
              {children}
            </main>
            <Toaster />
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
