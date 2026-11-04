"use client";
import React from "react";
import Filter from "@/components/Filter";
import { getProductsPage, getProductsByBrand, getProductsBySearch } from "@/apis/products";
import ProductDisplay from "@/components/Products/ProductDisplay";
import { useSearchParams } from "next/navigation";
import ProductGridSkeleton from "@/skeletons/ProductGridSkeleton";

export default function StationsCatalog() {
  const searchparams = useSearchParams();
  const brand = searchparams.get("brand") || "";
  const type = searchparams.get("type") || "";
  const search = searchparams.get("q") || "";
  const filterMap: Record<string, string> = {
    handstation: "Гар станц",
    basestation: "Суурин станц",
    equipments: "Дагалдах хэрэгслүүд",
  };

  const category = type ? filterMap[type] : undefined;
  const fetcher = (cursor?: string, order?: string) => search
    ? getProductsBySearch(search, cursor, { brand: brand || undefined, sort: category, order })
    : brand
      ? getProductsByBrand({ brand, cursor, sort: category, order })
      : getProductsPage(cursor, { sort: category, order });
  const title = search ? `Хайлтын үр дүн: ${search}` : type ? filterMap[type] : "Бүх бараа";

  return (
    <div className="flex flex-col lg:flex-row px-4 md:px-8 lg:px-12">
      <Filter />
      <div className="w-full flex flex-col p-4">
        <ProductDisplay title={title} fetcher={fetcher} fetcherKey={[brand, type, search]} loader={<ProductGridSkeleton />} />
      </div>
    </div>
  );
}
