// Keep local development usable if Next.js was started before .env.local existed.
// Production still requires an explicit backend URL.
export const baseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : undefined);
