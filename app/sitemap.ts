import type { MetadataRoute } from "next";
import { productCanonicalUrl, siteOrigin } from "@/lib/seo";
import { publicIndexingEnabled } from "@/lib/indexing";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!publicIndexingEnabled) return [];
  const entries: MetadataRoute.Sitemap = [
    { url: siteOrigin, changeFrequency: "daily", priority: 1 },
    { url: `${siteOrigin}/stations`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteOrigin}/brands/retevis`, changeFrequency: "daily", priority: 0.85 },
  ];
  if (!backendUrl) return entries;

  let cursor: string | null = null;
  const seen = new Set<string>();
  try {
    // Mongo feed is a projected, 1000-record cursor endpoint; never fetch catalog details here.
    while (entries.length < 50_000) {
      const params = new URLSearchParams({ limit: "1000" });
      if (cursor) params.set("cursor", cursor);
      const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/product/sitemap?${params}`, {
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json() as {
        products: Array<{ name: string; updatedAt?: string }>;
        pagination: { hasMore: boolean; nextCursor: string | null };
      };
      for (const product of data.products || []) {
        if (!product.name) continue;
        const url = productCanonicalUrl(product.name);
        if (seen.has(url)) continue;
        seen.add(url);
        const lastModified = product.updatedAt ? new Date(product.updatedAt) : undefined;
        entries.push({
          url,
          changeFrequency: "weekly",
          priority: 0.7,
          ...(lastModified && !Number.isNaN(lastModified.getTime()) ? { lastModified } : {}),
        });
        if (entries.length >= 50_000) break;
      }
      const nextCursor = data.pagination?.nextCursor || null;
      if (!data.pagination?.hasMore || !nextCursor || nextCursor === cursor) break;
      cursor = nextCursor;
    }
  } catch {
    console.warn("Product sitemap feed unavailable; returning static sitemap entries.");
  }
  return entries;
}
