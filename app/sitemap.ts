import type { MetadataRoute } from "next";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://retevis.mn").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/stations`, changeFrequency: "daily", priority: 0.9 },
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
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json() as {
        products: Array<{ name: string }>;
        pagination: { hasMore: boolean; nextCursor: string | null };
      };
      for (const product of data.products || []) {
        if (!product.name) continue;
        const url = `${siteUrl}/stations/${encodeURIComponent(product.name)}`;
        if (seen.has(url)) continue;
        seen.add(url);
        entries.push({ url, changeFrequency: "weekly", priority: 0.7 });
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
