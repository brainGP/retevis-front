"use client";
import React from "react";
import ProductGrid from "./ProductGrid";
import { getNewProducts } from "@/apis/products";
import { useQuery } from "@tanstack/react-query";
import ProductGridSkeleton from "@/skeletons/ProductGridSkeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const NewProducts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryFn: getNewProducts,
    queryKey: ["new", "products"],
  });

  return (
    <section className="site-container py-10 sm:py-14" aria-labelledby="new-products-heading">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Retevis Mongolia</p>
          <h2 id="new-products-heading" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Шинэ бүтээгдэхүүн</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">Харилцаа холбооны шинэ төхөөрөмж, хэрэгслүүдтэй танилцаарай.</p>
        </div>
        <Link href="/stations" className="mb-1 hidden shrink-0 items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-amber-700 sm:inline-flex">
          Бүх бараа <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {isLoading ? <ProductGridSkeleton count={5} /> : error ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center" role="alert">
          <p className="mb-3 text-slate-700">Шинэ бүтээгдэхүүн татаж чадсангүй.</p>
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50" onClick={() => refetch()}>Дахин оролдох</button>
        </div>
      ) : data?.length ? <ProductGrid products={data} /> : (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">Одоогоор шинэ бүтээгдэхүүн алга байна.</div>
      )}
      <Link href="/stations" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 sm:hidden">
        Бүх бараа <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
};

export default NewProducts;
