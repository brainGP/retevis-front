import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "../providers";
import CartProvider from "@/providers/CartProvider";
import { absoluteSiteUrl, siteOrigin } from "@/lib/seo";

const indexingEnabled = process.env.NODE_ENV === "production" && process.env.RETEVIS_INDEXING === "true" && process.env.VERCEL_ENV !== "preview";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  alternates: { canonical: "/" },
  title: {
    default: "Retevis",
    template: `%s | Станцын төрөлжсөн дэлгүүр`,
  },
  description: "Монголын холбооны радио станц, дагалдах хэрэгслийн төрөлжсөн дэлгүүр.",
  icons: "/Retevis/RMlogo.png",
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "Retevis Mongolia",
    title: "Retevis | Станцын төрөлжсөн дэлгүүр",
    description: "Монголын холбооны радио станц, дагалдах хэрэгслийн төрөлжсөн дэлгүүр.",
    images: [{ url: absoluteSiteUrl("/Retevis/RMlogo.png"), alt: "Retevis Mongolia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Retevis | Станцын төрөлжсөн дэлгүүр",
    description: "Монголын холбооны радио станц, дагалдах хэрэгслийн төрөлжсөн дэлгүүр.",
    images: [absoluteSiteUrl("/Retevis/RMlogo.png")],
  },
  robots: {
    index: indexingEnabled,
    follow: indexingEnabled,
    googleBot: { index: indexingEnabled, follow: indexingEnabled, "max-image-preview": "large" },
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
