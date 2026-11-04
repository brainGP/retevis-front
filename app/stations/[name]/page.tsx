import Breadcrumb from "@/components/BreadCrumb";
import BackButton from "@/components/BackButton";
import { getProductByName } from "@/apis/products";
import RelatedProducts from "./related";
import StationCard from "./station";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";

const getStation = cache((name: string) => getProductByName({ name }));
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://retevis.mn").replace(/\/$/, "");

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const station = await getStation(name).catch(() => null);
  if (!station) return { title: "Бараа олдсонгүй", robots: { index: false, follow: false } };
  const description = `${station.brand} ${station.name}. ${String(station.description || "").slice(0, 150)}`.slice(0, 200);
  const canonical = `${siteUrl}/stations/${encodeURIComponent(station.name)}`;
  const image = station.images?.[0]?.image;
  return {
    title: station.name,
    description,
    alternates: { canonical },
    openGraph: { type: "website", title: station.name, description, url: canonical, ...(image ? { images: [{ url: image, alt: station.name }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title: station.name, description, ...(image ? { images: [image] } : {}) },
    robots: { index: process.env.NODE_ENV === "production" && process.env.RETEVIS_INDEXING === "true" && process.env.VERCEL_ENV !== "preview", follow: true },
  };
}

const StationNamePage = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const name = (await params).name;
  const station = await getStation(name);
  if (!station) notFound();
  const price = Number(String(station.priceN || station.price || "").replace(/[^0-9.]/g, ""));
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: station.name,
    description: station.description,
    sku: station.id || station._id,
    brand: { "@type": "Brand", name: station.brand },
    image: (station.images || []).map((entry) => entry.image).filter(Boolean),
    ...(Number.isFinite(price) && price > 0 ? { offers: { "@type": "Offer", priceCurrency: "MNT", price, availability: Number(station.quantity) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${siteUrl}/stations/${encodeURIComponent(station.name)}` } } : {}),
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Нүүр", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Бүтээгдэхүүн", item: `${siteUrl}/stations` },
      { "@type": "ListItem", position: 3, name: station.name, item: `${siteUrl}/stations/${encodeURIComponent(station.name)}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData).replace(/</g, "\\u003c") }} />
      <div className="px-8 md:px-12 lg:px-16 flex-1 justify-center gap-8">
        <div className="flex gap-4 items-center pt-4">
          <BackButton />
          <Breadcrumb />
        </div>
        <StationCard station={station} />
        <RelatedProducts brand={station.brand} id={station._id} />
      </div>
    </>
  );
};

export default StationNamePage;
