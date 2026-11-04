import type { Metadata } from "next";
import StationsCatalog from "./catalog";

const indexingEnabled = process.env.NODE_ENV === "production" && process.env.RETEVIS_INDEXING === "true" && process.env.VERCEL_ENV !== "preview";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Boolean(params.q || params.brand || params.type);
  return {
    title: params.q ? `Хайлт: ${String(params.q).slice(0, 60)}` : "Бүтээгдэхүүний каталог",
    description: "Холбооны радио станц болон дагалдах хэрэгслийн каталог.",
    alternates: { canonical: `${(process.env.NEXT_PUBLIC_SITE_URL || "https://retevis.mn").replace(/\/$/, "")}/stations` },
    robots: { index: indexingEnabled && !hasFilters, follow: true },
  };
}

export default function StationsPage() {
  return <StationsCatalog />;
}
