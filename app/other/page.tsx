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
    <div className="flex flex-col lg:flex-row px-4 md:px-8 lg:px-12">
      <Filter />
      <div className="w-full flex flex-col p-4">
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
