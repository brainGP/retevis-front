import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";
import { publicIndexingEnabled } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: publicIndexingEnabled
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}
