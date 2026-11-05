import { ImageResponse } from "next/og";
import OgPreview from "@/components/OgPreview";
import { cleanProductDescription } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Retevis Mongolia бүтээгдэхүүний мэдээлэл";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ProductPreview = {
  name?: string;
  brand?: string;
  model?: string;
  type?: string;
  sort?: string;
  description?: string;
  priceN?: string | number;
  price?: string | number;
  status?: boolean;
  quantity?: number;
  images?: Array<{ image?: string }>;
};

async function getProduct(name: string): Promise<ProductPreview | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return null;
  try {
    const url = `${backendUrl.replace(/\/$/, "")}/api/product/find/${encodeURIComponent(name)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!response.ok) return null;
    return await response.json() as ProductPreview;
  } catch {
    return null;
  }
}

function safeProductImage(value: string | undefined): string | undefined {
  try {
    const image = new URL(value || "");
    return image.protocol === "https:" && image.hostname === "res.cloudinary.com"
      ? image.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export default async function ProductOpenGraphImage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const product = await getProduct(name);
  const price = Number(String(product?.priceN || product?.price || "").replace(/[^0-9.]/g, ""));
  const priceLabel = Number.isFinite(price) && price > 0
    ? `${new Intl.NumberFormat("en-MN", { maximumFractionDigits: 0 }).format(price)}₮`
    : undefined;

  return new ImageResponse(
    <OgPreview
      eyebrow={[product?.brand, product?.model].filter(Boolean).join(" · ").slice(0, 30) || "Retevis Mongolia"}
      title={product?.name || name}
      description={cleanProductDescription(product?.description, "Холбооны станцын үзүүлэлт, үнэ болон бэлэн байдлыг лавлаарай.")}
      imageUrl={safeProductImage(product?.images?.[0]?.image)}
      priceLabel={priceLabel}
      detailLabel={`${product?.status && Number(product.quantity) > 0 ? "Бэлэн" : "Нөөцийг лавлах"}${product?.type || product?.sort ? ` · ${product.type || product.sort}` : ""}`}
    />,
    size,
  );
}
