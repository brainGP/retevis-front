import { LoadingWait } from "@/components/LoadingWait";
import ProductGridSkeleton from "@/skeletons/ProductGridSkeleton";
import React from "react";

const LoadingPage = () => {
  return (
    <main className="site-container min-h-[70vh] py-8 sm:py-12" aria-busy="true" aria-live="polite">
      <div className="mb-8 animate-pulse space-y-3">
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="h-8 w-56 max-w-full rounded bg-slate-200 sm:h-9" />
        <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
      </div>
      <div className="relative min-h-[35vh]">
        <ProductGridSkeleton count={5} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/35">
          <div className="rounded-full border border-slate-200 bg-white/90 p-3 shadow-sm">
            <LoadingWait isLoading={true} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoadingPage;
