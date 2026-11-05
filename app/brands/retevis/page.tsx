import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/types/Product";
import { siteOrigin } from "@/lib/seo";
import { publicIndexingEnabled } from "@/lib/indexing";

const title = "Retevis Mongolia — Retevis холбооны радио станц";
const description = "Монгол дахь Retevis брэндийн гар станц, суурин станц болон хоёр талын радио холбооны төхөөрөмжийг загвар, үзүүлэлт, үнээр нь харьцуулан сонгоорой. Browse Retevis two-way radios in Mongolia.";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${siteOrigin}/brands/retevis` },
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "Retevis Mongolia",
    title,
    description,
    url: `${siteOrigin}/brands/retevis`,
    images: [{ url: `${siteOrigin}/Retevis/RMlogo.png`, alt: "Retevis Mongolia" }],
  },
  robots: {
    index: publicIndexingEnabled,
    follow: true,
    googleBot: { index: publicIndexingEnabled, follow: true, "max-image-preview": "large" },
  },
};

async function getRetevisProducts(): Promise<Product[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");
  if (!backendUrl) return [];

  try {
    const url = new URL("/api/product", backendUrl);
    url.searchParams.set("brand", "RETEVIS");
    url.searchParams.set("limit", "12");
    const response = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return [];
    const data = await response.json() as { products?: Product[] };
    return Array.isArray(data.products) ? data.products : [];
  } catch {
    return [];
  }
}

export default async function RetevisBrandPage() {
  const products = await getRetevisProducts();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${siteOrigin}/brands/retevis`,
    inLanguage: "mn-MN",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteOrigin}/stations/${encodeURIComponent(product.name)}`,
        name: product.name,
      })),
    },
  };

  return (
    <>
      <Header />
      <main className="site-container min-h-[65vh] py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">Нүүр</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page">Retevis</span>
        </nav>
        <header className="mb-7 max-w-3xl sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">Retevis Mongolia</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">Retevis холбооны станц, радио хэрэгсэл</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Гар станц, суурин станц болон хоёр талын радио холбооны төхөөрөмжийг хэрэглээ, үзүүлэлт, үнээр нь харьцуулаарай. Бүтээгдэхүүний бэлэн байдал, үнийг захиалгын өмнө лавлаж баталгаажуулна.
          </p>
          <p className="mt-2 text-sm text-slate-500">Browse Retevis two-way radios, handheld radios and communication equipment in Mongolia.</p>
        </header>

        {products.length ? (
          <ProductGrid title="Retevis бүтээгдэхүүн" products={products} />
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600" aria-live="polite">
            Каталогийг одоогоор ачаалж чадсангүй. Бүх барааг каталогоос үзнэ үү.
            <Link href="/stations?brand=RETEVIS" className="ml-1 font-semibold text-slate-900 underline underline-offset-4">Retevis каталог нээх</Link>
          </section>
        )}

        <Link href="/stations?brand=RETEVIS" className="mt-8 inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50">
          Бүх Retevis барааг үзэх
        </Link>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
