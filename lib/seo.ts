const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteOrigin = (() => {
  if (!configuredSiteUrl) return "https://www.retevis.mn";
  try {
    return new URL(configuredSiteUrl).origin;
  } catch {
    return "https://www.retevis.mn";
  }
})();

export function absoluteSiteUrl(path: string): string {
  return new URL(path.startsWith("/") ? path : `/${path}`, `${siteOrigin}/`).toString();
}

export function productCanonicalUrl(name: string): string {
  return absoluteSiteUrl(`/stations/${encodeURIComponent(name)}`);
}

export function cleanProductDescription(value: unknown, fallback: string): string {
  const clean = String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const description = clean || fallback.trim();
  if (description.length <= 160) return description;
  return `${description.slice(0, 157).trimEnd()}…`;
}

export function toAbsoluteImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    return new URL(value.trim(), `${siteOrigin}/`).toString();
  } catch {
    return null;
  }
}
