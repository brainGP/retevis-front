import { ImageResponse } from "next/og";
import OgPreview from "@/components/OgPreview";
import { formatPrice } from "@/utils/formatPrice";

export const runtime = "edge";
export const alt = "Retevis Mongolia — холбооны станц, радио хэрэгсэл";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

type FeaturedProduct = {
  name?: string;
  priceN?: string | number;
  price?: string | number;
  images?: Array<{ image?: string }>;
};

async function getFeaturedProduct(): Promise<FeaturedProduct | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return null;
  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/product/?new=true`, {
      signal: AbortSignal.timeout(7000),
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const result = await response.json() as { products?: FeaturedProduct[] };
    return result.products?.find((product) => product.images?.some((image) => image.image)) || null;
  } catch {
    return null;
  }
}

function safeProductImage(value: string | undefined): string | undefined {
  try {
    const image = new URL(value || "");
    return image.protocol === "https:" && image.hostname === "res.cloudinary.com" ? image.toString() : undefined;
  } catch {
    return undefined;
  }
}

export default async function OpenGraphImage() {
  const featured = await getFeaturedProduct();
  const imageUrl = safeProductImage(featured?.images?.find((image) => image.image)?.image);
  const price = Number(String(featured?.priceN || featured?.price || "").replace(/[^0-9.]/g, ""));

  return new ImageResponse(
    <OgPreview
      eyebrow={featured ? "Шинээр нэмэгдсэн бараа" : "Retevis Mongolia"}
      title="Холбооны станцаа хэрэглээндээ тохируулан сонгоорой"
      description="Гар болон суурин станц, холбооны хэрэгслийг загвар, үзүүлэлтээр нь харьцуулна."
      imageUrl={imageUrl}
      priceLabel={price > 0 ? `${formatPrice(price)} ₮` : undefined}
      detailLabel={featured?.name || "Бүтээгдэхүүний каталог"}
    />,
    size,
  );
}
