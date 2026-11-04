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
    <div className="site-container flex flex-col gap-4 py-4 lg:flex-row lg:gap-8">
      <Filter />
      <div className="min-w-0 w-full flex-1 py-2 lg:py-4">
        <ProductDisplay title={title} fetcher={fetcher} fetcherKey={[brand, type, search]} loader={<ProductGridSkeleton />} />
      </div>
    </div>
  );
}
