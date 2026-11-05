# Retevis Mongolia storefront

Next.js App Router storefront for browsing radio equipment, searching and filtering products, managing a local cart, and providing administrator product and banner screens. The Express/MongoDB API lives in `../retevis-backend`.

## Local setup

Install dependencies with `npm install`. Local development defaults to the backend on `http://localhost:8000`; an ignored `.env.local` is included with that setting. For another backend, set its reachable API base URL in `NEXT_PUBLIC_BACKEND_URL`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Reachable base URL of the backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional public Google Web Client ID; must match backend `GOOGLE_CLIENT_ID` |
| `NEXT_PUBLIC_SITE_URL` | Canonical public storefront origin used for metadata and sitemap |
| `RETEVIS_INDEXING` | Set exactly to `false` to disable indexing; production is indexable by default and Vercel previews are always noindex |

Start the frontend with `npm run dev` and open `http://localhost:3000`. `npm run build` creates the production build. The configured lint script is `npm run lint`.

## Main routes

- `/` storefront home
- `/stations` catalog; supports `brand`, `type`, and `q` URL parameters
- `/stations/[name]` product details
- `/brands/retevis` server-rendered Retevis brand catalog and brand information
- `/cart`, `/contact`, `/login`, `/register`, and `/profile` (signed-in account settings)
- `/admin` product, user, and banner management

## Storefront visual style

The storefront keeps the Retevis logo and restrained yellow/navy palette. Shared navigation uses clear active states and compact mobile labels; catalog cards prioritize product photography, readable names, and price. Avoid decorative gradients or effects that compete with product images.

Storefront content sections share the `.site-container` width. Search suggestions show recently searched terms and up to five real newest database products when the input is focused but empty. Buttons use short hover/focus feedback, and route/catalog skeletons use the same product-card proportions while preserving the centered loading indicator.

Search suggestions query the backend after a short pause and display a bounded result set. The cart is stored in the current browser's local storage; it is not a server-side order or checkout system.

Admin product and banner uploads send directly to the configured backend, avoiding the extra Next.js Server Action transfer. Local development uses `http://localhost:8000`; hosted frontend origins must be included in the backend's `ALLOWED_CORS` setting. Supported browser uploads are compressed to WebP when that produces a smaller file, then resized/compressed again during Cloudinary ingestion.

The admin workspace shares a compact section navigation for products, banners, and users. Product inventory can be searched by catalog text and filtered by category; product and banner dialogs show image previews, compress images in the browser where supported, and retain the form on save failure. Uploaded images must fit the backend's 5MB-per-image limit after browser compression.

The admin product table supports inline stock quantity edits and an active/hidden visibility control. Only products with `status: "true"` are returned by public catalog, search, newest-product, detail, and sitemap APIs; the authenticated admin inventory continues to include hidden products. Set the quantity to `0` to mark the item out of stock while keeping it visible if it remains active.

Browser authentication credentials are backend-set HttpOnly cookies; the in-memory frontend profile is only a display hint and is not an authorization source. Backend authorization reloads current user/admin status. The cart and optional recent searches use localStorage; passwords and tokens are never stored there. See `../GOOGLE_AUTH_SETUP.md` for cookie, refresh, origin, session, and Google setup policy.

The account menu links to `/profile`. Users can update their display username and use an emailed one-time code to create or replace their password; email changes are not available. Google account linking requires a recently authenticated session and a verified Google email matching the account email. The API returns only a `googleLinked` status, never the Google subject. GIS button setup retries across script/hydration timing and presents a load error if Google's script is unavailable. Resend credentials are configured only in the backend; see `../retevis-backend/README.md`.

The catalog uses cursor-based pages (24 products initially, up to 48 per request) and loads subsequent pages on demand using normal page scrolling. A failed later page keeps already loaded products visible and offers a retry. Search suggestions are bounded real API results; an empty search restores the normal filtered catalog. Search supports Mongolian/English radio, handheld/base-station, antenna, headset, battery, charger and Retevis terms, transliteration variants, short prefixes, typo tolerance and price/location filler words. Efficient indexed matching still requires running and verifying the explicit backend catalog field/index preparation script; the live database preview in this workspace could not connect, and no index/backfill change was applied. See `../SEARCH_ARCHITECTURE.md` and `../PERFORMANCE_ARCHITECTURE.md` for rollout details.

Filtered search/catalog URLs and admin/private routes are excluded from indexing. Product pages generate a canonical URL, a clean Mongolian description, product-specific Open Graph/Twitter previews from real catalog images, and Product plus Breadcrumb JSON-LD. The `/brands/retevis` page uses the live product API and is linked from the Retevis logo. The home page defines the Retevis Mongolia organization and its actual social profiles. Production Google indexing is enabled by default; set `RETEVIS_INDEXING=false` to opt out. Vercel previews remain noindex. `NEXT_PUBLIC_SITE_URL` must be the canonical production origin (`https://www.retevis.mn`). Submit `https://www.retevis.mn/sitemap.xml` in Google Search Console and inspect the home, brand, and product URLs after deployment.

The shared header's upper search/account row scrolls naturally, while one independent sticky navigation row stays fixed at the viewport top. It avoids scroll-triggered height transitions that caused the navigation to jump when the upper row collapsed.

Product detail galleries use every stored product image. The selected image fills the gallery frame with contain scaling; customers can switch with the thumbnail rail or open the full-screen viewer, use arrow keys/buttons, and select any image.

## Related documentation

See `../retevis-backend/README.md` for API setup, required backend environment variables, password migration behavior, and the catalog API contract. See `../GOOGLE_SEARCH_SETUP.md` for production indexing, Search Console, sitemap, and product structured-data verification.


## Account access and recovery

Email/password registration sends an email verification code before creating a usable session. Users can request a fresh code from the registration verification screen. Google Sign-In continues to verify Google credentials on the backend. The login page links to `/forgot-password`; that screen requests a generic password reset response, verifies a six-digit email code, and resets the password. Resetting a password revokes existing sessions, so the user signs in again. Google-only accounts can use profile password setup or the same email recovery flow to create a password. Authentication credentials are held in HttpOnly backend cookies; browser profile data is only a UI hint.
