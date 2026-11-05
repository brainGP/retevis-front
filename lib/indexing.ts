/** Public search indexing is enabled on production unless explicitly disabled.
 * Vercel preview deployments stay noindex regardless of this setting. */
export const publicIndexingEnabled =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview" &&
  process.env.RETEVIS_INDEXING !== "false";
