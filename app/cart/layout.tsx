import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Retevis",
  description: "Retevis Mongolia",
  robots: { index: false, follow: false },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
