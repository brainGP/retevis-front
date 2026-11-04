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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
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
    <Link href={`/stations/${product.name}`}>
      <div className="border hover:border-gray/30 transition-all duration-300 h-[280px] md:h-[300px] w-full rounded-md bg-white group flex flex-col">
        <div className="relative h-48 w-full rounded-md px-4 py-2 md:py-4 overflow-hidden flex items-center justify-center">
          <ProductImage
            src={imgUrl || "/noresult.png"}
            alt={product.name}
            width={200}
            height={200}
            className="object-contain w-full h-full px- transition-all duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg">{formatText(product.name)}</h3>
          <p className="font-bold text-xl">{formatPrice(product.priceN)}₮</p>
          <p className="text-sm text-start">
            {product.type} {product.style}
          </p>
        </div>
      </div>
    </Link>
  );
};
