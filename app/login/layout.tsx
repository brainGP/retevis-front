import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Нэвтрэх", robots: { index: false, follow: false } };
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
