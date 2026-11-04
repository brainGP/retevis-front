"use client";
import React from "react";
import Filter from "@/components/Filter";
import { getProductsPage, getProductsByBrand } from "@/apis/products";
import ProductDisplay from "@/components/Products/ProductDisplay";
import { useSearchParams } from "next/navigation";
import ProductGridSkeleton from "@/skeletons/ProductGridSkeleton";

const OtherPage = () => {
  const searchparams = useSearchParams();
  const brand = searchparams.get("brand") as string;
  const type = searchparams.get("type") as string;

  const filterMap: Record<string, string> = {
    other: "Бусад бараа",
  };

  const fetcher = (cursor?: string, order?: string) => brand
    ? getProductsByBrand({ brand, cursor, sort: type ? filterMap.other : undefined, order })
    : getProductsPage(cursor, { sort: type ? filterMap.other : undefined, order });

  const title = "Бусад бараа";

  return (
    <div className="site-container flex flex-col gap-4 py-4 lg:flex-row lg:gap-8">
      <Filter />
      <div className="min-w-0 w-full flex-1 py-2 lg:py-4">
        <ProductDisplay
          title={title}
          fetcher={fetcher}
          fetcherKey={[brand, type || "other"]}
          loader={<ProductGridSkeleton />}
        />
      </div>
    </div>
  );
};

export default OtherPage;
