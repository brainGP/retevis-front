import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://retevis.mn").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NODE_ENV === "production" && process.env.RETEVIS_INDEXING === "true" && process.env.VERCEL_ENV !== "preview";
  return {
    rules: indexable
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/cart", "/login", "/register"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
