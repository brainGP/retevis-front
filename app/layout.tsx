import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "../providers";
import CartProvider from "@/providers/CartProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://retevis.mn"),
  title: {
    default: "Retevis",
    template: `%s | Станцын төрөлжсөн дэлгүүр`,
  },
  description: "Retevis Mongolia",
  icons: "/Retevis/RMlogo.png",
  verification: {
    google: "google",
    yandex: "yandex",
    yahoo: "yahoo",
    other: {
      me: ["my-email", "my-link"],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta
          name="google-site-verification"
          content="nWxsj2YVieYZPW8U8CXGojl4mRk5ii9knhDp4KWZiNc"
        />
      </head>
      <body className="bg-gray/[2%] overflow-x-hidden">
        <CartProvider>
          <Providers>
            <main className="w-full max-w-screen overflow-x-hidden mx-auto">
              {children}
            </main>
            <Toaster />
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
