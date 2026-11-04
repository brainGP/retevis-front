const CACHE_EVENT = "retevis:catalog-changed";

export function notifyCatalogChanged(scope: "products" | "banners" = "products") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CACHE_EVENT, { detail: scope }));
  try { localStorage.setItem("retevis.catalogChanged", `${scope}:${Date.now()}`); } catch { /* Storage can be disabled. */ }
}

export { CACHE_EVENT };
