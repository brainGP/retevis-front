import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "../providers";
import CartProvider from "@/providers/CartProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://retevis.mn"),
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
  },
  robots: {
    index: process.env.NODE_ENV === "production" && process.env.RETEVIS_INDEXING === "true" && process.env.VERCEL_ENV !== "preview",
    follow: process.env.NODE_ENV === "production" && process.env.RETEVIS_INDEXING === "true" && process.env.VERCEL_ENV !== "preview",
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
