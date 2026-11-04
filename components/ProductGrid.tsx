import React from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { Product } from "@/types/Product";
import { formatPrice } from "@/utils/formatPrice";
import { formatText } from "@/utils/formatText";

interface ProductGridProps {
  title?: string;
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products }) => {
  return (
    <section className="mx-auto text-gray">
      {title && (
        <div className="flex items-center gap-4 my-6 ">
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {title}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
        {products.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

const ProductCard = ({ product }: { product: Product }) => {
  const imgUrl = product.images?.[0]?.image || "/noresult.png";

  return (
    <Link href={`/stations/${product.name}`} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2">
      <article className="flex h-full min-h-[270px] flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-slate-300 group-hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:min-h-[300px]">
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-4 sm:p-5">
          <ProductImage
            src={imgUrl || "/noresult.png"}
            alt={product.name}
            width={200}
            height={200}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <p className="mb-1.5 truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{product.brand}</p>
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-800 transition-colors group-hover:text-slate-950 sm:text-base">
            {formatText(product.name)}
          </h3>
          <p className="mt-auto pt-3 text-base font-bold tracking-tight text-slate-900 sm:text-lg">{formatPrice(product.priceN)} <span className="text-sm font-semibold">₮</span></p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {[product.type, product.style].filter(Boolean).join(" · ")}
          </p>
        </div>
      </article>
    </Link>
  );
};
