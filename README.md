# Retevis Mongolia storefront

Next.js App Router storefront for browsing radio equipment, searching and filtering products, managing a local cart, and providing administrator product and banner screens. The Express/MongoDB API lives in `../retevis-backend`.

## Local setup

Install dependencies with `npm install`. Local development defaults to the backend on `http://localhost:8000`; an ignored `.env.local` is included with that setting. For another backend, set its reachable API base URL in `NEXT_PUBLIC_BACKEND_URL`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Reachable base URL of the backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional public Google Web Client ID; must match backend `GOOGLE_CLIENT_ID` |
| `NEXT_PUBLIC_SITE_URL` | Canonical public storefront origin used for metadata and sitemap |
| `RETEVIS_INDEXING` | Enable public indexing only for the real production deployment |

Start the frontend with `npm run dev` and open `http://localhost:3000`. `npm run build` creates the production build. The configured lint script is `npm run lint`.

## Main routes

- `/` storefront home
- `/stations` catalog; supports `brand`, `type`, and `q` URL parameters
- `/stations/[name]` product details
- `/cart`, `/contact`, `/login`, `/register`, and `/profile` (signed-in account settings)
- `/admin` product, user, and banner management

Search suggestions query the backend after a short pause and display a bounded result set. The cart is stored in the current browser's local storage; it is not a server-side order or checkout system.

Admin product and banner uploads send directly to the configured backend, avoiding the extra Next.js Server Action transfer. Local development uses `http://localhost:8000`; hosted frontend origins must be included in the backend's `ALLOWED_CORS` setting. Supported browser uploads are compressed to WebP when that produces a smaller file, then resized/compressed again during Cloudinary ingestion.

Browser authentication credentials are backend-set HttpOnly cookies; the in-memory frontend profile is only a display hint and is not an authorization source. Backend authorization reloads current user/admin status. The cart and optional recent searches use localStorage; passwords and tokens are never stored there. See `../GOOGLE_AUTH_SETUP.md` for cookie, refresh, origin, session, and Google setup policy.

The account menu links to `/profile`. Users can update only their display username there; email changes are unavailable until an email verification flow is added. Google account linking requires a recently authenticated session and a verified Google email matching the account email. The API returns only a `googleLinked` status, never the Google subject. GIS button setup retries across script/hydration timing and presents a load error if Google's script is unavailable.

The catalog uses cursor-based pages (24 products initially, up to 48 per request) and loads subsequent pages on demand. Search suggestions are bounded real API results; an empty search restores the normal filtered catalog. Search supports Mongolian/English synonyms, transliteration variants, short prefixes, and a constrained spelling-variant vocabulary. Efficient indexed matching requires running and verifying the explicit backend catalog field/index preparation script before enabling its production flag. See `../SEARCH_ARCHITECTURE.md` and `../PERFORMANCE_ARCHITECTURE.md` for rollout details.

Product search/filter pages and admin/private routes are excluded from indexing. Public product detail metadata, product JSON-LD, sitemap, and robots output require setting the real canonical site URL and explicitly enabling production indexing. Verify rendered HTML and the deployed robots/sitemap before launch.

## Related documentation

See `../retevis-backend/README.md` for API setup, required backend environment variables, password migration behavior, and the catalog API contract.
