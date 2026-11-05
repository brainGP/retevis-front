import Breadcrumb from "@/components/BreadCrumb";
import BackButton from "@/components/BackButton";
import { getProductByName } from "@/apis/products";
import RelatedProducts from "./related";
import StationCard from "./station";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { cleanProductDescription, productCanonicalUrl, siteOrigin, toAbsoluteImageUrl } from "@/lib/seo";
import { publicIndexingEnabled } from "@/lib/indexing";
import { formatPrice } from "@/utils/formatPrice";

const getStation = cache((name: string) => getProductByName({ name }));

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const station = await getStation(name).catch(() => null);
  if (!station) return { title: "Бараа олдсонгүй", robots: { index: false, follow: false } };

  const title = `${station.name} | ${station.brand} холбооны станц`;
  const fallbackDescription = `${station.brand} ${station.name} холбооны станц. ${station.type || station.sort || "Холбооны хэрэгсэл"}.`;
  const description = cleanProductDescription(station.description, fallbackDescription);
  const price = Number(station.priceN || station.price || 0);
  const socialDescription = cleanProductDescription(
    `${price > 0 ? `Үнэ: ${formatPrice(price)} ₮. ` : ""}${description}`,
    fallbackDescription,
  );
  const canonical = productCanonicalUrl(station.name);
  const imageUrl = `${canonical}/opengraph-image`;
  const keywords = [station.name, station.model, station.brand, station.type, station.sort, station.style]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "mn_MN",
      siteName: "Retevis Mongolia",
      title,
      description: socialDescription,
      url: canonical,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${station.brand} ${station.name} · үнэ, мэдээлэл` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: socialDescription,
      images: [imageUrl],
    },
    robots: {
      index: publicIndexingEnabled,
      follow: true,
      googleBot: { index: publicIndexingEnabled, follow: true, "max-image-preview": "large" },
    },
  };
}

const StationNamePage = async ({ params }: { params: Promise<{ name: string }> }) => {
  const name = (await params).name;
  const station = await getStation(name);
  if (!station) notFound();

  const price = Number(String(station.priceN || station.price || "").replace(/[^0-9.]/g, ""));
  const canonical = productCanonicalUrl(station.name);
  const description = cleanProductDescription(
    station.description,
    `${station.brand} ${station.name} холбооны станц. ${station.type || station.sort || "Холбооны хэрэгсэл"}.`,
  );
  const images = (Array.isArray(station.images) ? station.images : [])
    .map(({ image }) => toAbsoluteImageUrl(image))
    .filter((image): image is string => Boolean(image));
  const isActive = station.status;
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: station.name,
    description,
    sku: station.id || station._id,
    ...(station.model ? { mpn: station.model } : {}),
    ...(station.type || station.sort ? { category: station.type || station.sort } : {}),
    brand: { "@type": "Brand", name: station.brand },
    image: images.length ? images : [`${siteOrigin}/Retevis/RMlogo.png`],
    ...(Number.isFinite(price) && price > 0
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "MNT",
            price,
            availability: isActive && Number(station.quantity) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: canonical,
          },
        }
      : {}),
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Нүүр", item: siteOrigin },
      { "@type": "ListItem", position: 2, name: "Бүтээгдэхүүн", item: `${siteOrigin}/stations` },
      { "@type": "ListItem", position: 3, name: station.name, item: canonical },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData).replace(/</g, "\\u003c") }} />
      <div className="site-container flex-1 justify-center gap-8 py-4">
        <div className="flex items-center gap-4 pt-4">
          <BackButton />
          <Breadcrumb />
        </div>
        <StationCard station={station} canonicalUrl={canonical} />
        <RelatedProducts brand={station.brand} id={station._id} />
      </div>
    </>
  );
};

export default StationNamePage;
