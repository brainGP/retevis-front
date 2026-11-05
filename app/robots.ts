import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NODE_ENV === "production" && process.env.RETEVIS_INDEXING === "true" && process.env.VERCEL_ENV !== "preview";
  return {
    rules: indexable
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/cart", "/login", "/register"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}
