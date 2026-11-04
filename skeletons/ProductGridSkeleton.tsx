import React from "react";

const ProductGridSkeleton = ({ count = 24 }: { count?: number }) => (
  <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <article key={index} className="flex min-h-[270px] animate-pulse flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white sm:min-h-[300px]">
        <div className="aspect-square w-full bg-slate-50 p-4 sm:p-5">
          <div className="h-full w-full rounded-lg bg-slate-200/70" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
          <div className="h-3 w-1/3 rounded bg-slate-200" />
          <div className="mt-1 h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-4/5 rounded bg-slate-200" />
          <div className="mt-auto h-5 w-1/2 rounded bg-slate-300" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
        </div>
      </article>
    ))}
  </div>
);

export default ProductGridSkeleton;
