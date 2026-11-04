"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { CACHE_EVENT } from "@/lib/catalogCache";

const ReactQuery = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));
  useEffect(() => {
    const invalidate = (event: Event) => {
      const scope = (event as CustomEvent<string>).detail;
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes(scope) });
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "retevis.catalogChanged") {
        void queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("products") || query.queryKey.includes("banners") });
      }
    };
    window.addEventListener(CACHE_EVENT, invalidate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CACHE_EVENT, invalidate);
      window.removeEventListener("storage", onStorage);
    };
  }, [queryClient]);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQuery;
