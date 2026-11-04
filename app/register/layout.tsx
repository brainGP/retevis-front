import type { Metadata } from "next";
export const metadata: Metadata = { title: "Бүртгүүлэх", robots: { index: false, follow: false } };

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
