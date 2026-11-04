"use client";

import React, { ReactNode, useState } from "react";
import ProductGrid from "../ProductGrid";
import FilterOrder from "../FilterOrder";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Product } from "@/types/Product";
import type { ProductSearchPage } from "@/apis/products";
import { LoadingWait } from "../LoadingWait";
import BackButton from "../BackButton";
import Breadcrumb from "../BreadCrumb";
import TypeFilter from "../TypeFilter";
import { usePathname } from "next/navigation";

type SortOrder = "lowtohigh" | "hightolow";

type ProductDisplayProps = {
  title: string;
  hasSort?: boolean;
  fetcherKey?: string[];
  fetcher: (cursor?: string, order?: SortOrder) => Promise<ProductSearchPage>;
  filter?: (product: Product) => boolean;
  error?: ReactNode;
  loader?: ReactNode;
};

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  title,
  hasSort = true,
  fetcherKey = [],
  fetcher,
  filter,
  error = (
    <div className="w-full h-64">
      <div className="flex absolute my-4">
        <BackButton />
      </div>
      <div className=" flex justify-center items-center w-full h-full">
        <span className="text-center">Жагсаалт хоосон байна</span>
      </div>
    </div>
  ),
  loader = (
    <div className="w-full flex justify-center items-center">
      <LoadingWait isLoading={true} />
    </div>
  ),
}) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("lowtohigh");
  const filterKey = fetcherKey.join("\u0000");
  const { data, isLoading, isError, isFetchNextPageError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryFn: ({ pageParam }) => fetcher(pageParam, sortOrder),
    queryKey: [sortOrder, filterKey, "products"],
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.hasMore ? lastPage.pagination.nextCursor || undefined : undefined,
  });
  const products = (data?.pages.flatMap((page) => page.products) || []).filter((product) => !filter || filter(product));

  const handleOrderChange = (order: SortOrder) => {
    setSortOrder(order);
  };
  const pathname = usePathname();
  const showTypeFilter = pathname.startsWith("/stations");

  return (
    <div className="w-full flex flex-col relative">
      {hasSort && (
        <div className="w-full flex flex-wrap gap-4 items-center justify-between md:pr-4 py-4">
          <Breadcrumb />
          <div className="w-full flex justify-between gap-4">
            {showTypeFilter && <TypeFilter />}
            <FilterOrder onOrderChange={handleOrderChange} />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex w-full min-w-0 justify-center items-start bg-white bg-opacity-50 overflow-hidden">
          {loader}
        </div>
      )}
      {isError && !data && !isLoading && (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center" role="alert">
          <p>Бүтээгдэхүүний жагсаалтыг татаж чадсангүй.</p>
          <button className="rounded border px-4 py-2 hover:bg-gray/5" onClick={() => refetch()}>Дахин оролдох</button>
        </div>
      )}
      {data && products.length > 0 && !isLoading && (
        <ProductGrid title={title} products={products} />
      )}
      {!products.length && !isLoading && !isError && error}
      {data && hasNextPage && !isLoading && (
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            {isFetchNextPageError && <p className="text-sm text-amber-800" role="alert">Дараагийн барааг татаж чадсангүй. Өмнөх үр дүнгүүд хэвээр үлдлээ.</p>}
            <button className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium transition-colors hover:bg-slate-50 disabled:opacity-50" disabled={isFetchingNextPage} onClick={() => void fetchNextPage()}>
              {isFetchingNextPage ? "Ачаалж байна..." : isFetchNextPageError ? "Дахин оролдох" : "Илүү бүтээгдэхүүн үзэх"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
