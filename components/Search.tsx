"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import ProductImage from "@/components/ProductImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types/Product";
import { getNewProducts, searchProducts } from "@/apis/products";
import { formatPrice } from "@/utils/formatPrice";

const Search = () => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popoverPosition, setPopoverPosition] = useState({ top: 120, left: 12, width: 320, maxHeight: 480 });
  const requestId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const emptyQuery = !query.trim();
  const recommendations = useQuery({
    queryKey: ["products", "search-recommendations"],
    queryFn: getNewProducts,
    enabled: isDropdownVisible && emptyQuery,
    staleTime: 2 * 60 * 1000,
  });
  const visibleProducts = emptyQuery ? recommendations.data || [] : filteredProducts;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("retevis.recentSearches") || "[]");
      if (Array.isArray(saved)) setRecentSearches(saved.filter((item) => typeof item === "string").slice(0, 5));
    } catch { /* Ignore malformed local UI state. */ }
  }, []);

  useEffect(() => {
    if (!isDropdownVisible) return;

    const updatePosition = () => {
      // Measure the full rounded control, including its search button, not just the text input.
      const rect = searchBarRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(rect.width, window.innerWidth - 24);
      const top = Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - 160));
      setPopoverPosition({
        top,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
        width,
        maxHeight: Math.max(80, window.innerHeight - top - 12),
      });
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const resizeObserver = typeof ResizeObserver !== "undefined" && searchBarRef.current
      ? new ResizeObserver(updatePosition)
      : null;
    if (resizeObserver && searchBarRef.current) resizeObserver.observe(searchBarRef.current);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [isDropdownVisible]);

  useEffect(() => {
    if (!isDropdownVisible) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsDropdownVisible(false);
      setActiveIndex(-1);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isDropdownVisible]);

  const submitSearch = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const next = [normalized, ...recentSearches.filter((entry) => entry !== normalized)].slice(0, 5);
    setRecentSearches(next);
    try { localStorage.setItem("retevis.recentSearches", JSON.stringify(next)); } catch { /* Storage can be disabled. */ }
    setIsDropdownVisible(false);
    router.push(`/stations?q=${encodeURIComponent(normalized)}`);
  };

  const highlight = (text: string, value: string) => {
    const term = value.trim();
    const start = text.toLocaleLowerCase().indexOf(term.toLocaleLowerCase());
    if (!term || start < 0) return text;
    return <>{text.slice(0, start)}<mark className="rounded bg-yellow/50">{text.slice(start, start + term.length)}</mark>{text.slice(start + term.length)}</>;
  };

  useEffect(() => {
    const currentRequest = ++requestId.current;
    const value = query.trim();
    setSearchFailed(false);
    if (!value) {
      setFilteredProducts([]);
      setIsSearching(false);
      setActiveIndex(-1);
      return;
    }
    if (value.length < 2) {
      setFilteredProducts([]);
      setIsSearching(false);
      return;
    }
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(value);
        if (currentRequest === requestId.current) setFilteredProducts(results);
      } catch {
        if (currentRequest === requestId.current) {
          setFilteredProducts([]);
          setSearchFailed(true);
        }
      } finally {
        if (currentRequest === requestId.current) setIsSearching(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query, retryCount]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setIsSearching(Boolean(value.trim()));
    setIsDropdownVisible(true);
    setActiveIndex(-1);
  };

  const selectProduct = (product: Product) => {
    setIsDropdownVisible(false);
    router.push(`/stations/${encodeURIComponent(product.name)}`);
  };

  const renderProductOption = (product: Product, index: number) => (
    <button
      key={product._id}
      id={`search-option-${product._id}`}
      type="button"
      role="option"
      aria-selected={activeIndex === index}
      className={`flex min-h-[76px] w-full items-center gap-3 border-b border-slate-100 px-3 py-2 text-left transition-colors hover:bg-slate-50 sm:px-4 ${activeIndex === index ? "bg-amber-50/70" : "bg-white"}`}
      onMouseEnter={() => setActiveIndex(index)}
      onClick={() => selectProduct(product)}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-1.5">
        <ProductImage src={product.images?.[0]?.image} alt={product.name || "Бүтээгдэхүүний зураг"} width={56} height={56} className="h-full w-full object-contain" loading="lazy" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="line-clamp-2 text-sm font-medium leading-5 text-slate-800">{highlight(product.name, query)}</span>
        <span className="mt-1 block truncate text-xs text-slate-500">{[product.brand, product.style].filter(Boolean).join(" · ")}</span>
      </div>
      <span className="shrink-0 whitespace-nowrap text-right text-sm font-semibold text-slate-900">{formatPrice(product.priceN)}₮</span>
    </button>
  );

  return (
    <div className={`relative w-full max-w-2xl text-gray ${isDropdownVisible ? "pointer-events-none z-[102]" : "z-0"}`}>
      <div ref={searchBarRef} className="relative z-[102] flex w-full pointer-events-auto items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm transition-shadow focus-within:border-amber-300 focus-within:shadow-[0_0_0_3px_rgba(255,172,4,0.12)]">
        <Input
          type="search"
          placeholder="Хайлт хийх..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsDropdownVisible(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && visibleProducts.length) {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % visibleProducts.length);
            } else if (event.key === "ArrowUp" && visibleProducts.length) {
              event.preventDefault();
              setActiveIndex((index) => index <= 0 ? visibleProducts.length - 1 : index - 1);
            } else if (event.key === "Escape") {
              setIsDropdownVisible(false);
              setActiveIndex(-1);
            } else if (event.key === "Enter") {
              if (activeIndex >= 0 && visibleProducts[activeIndex]) {
                event.preventDefault();
                selectProduct(visibleProducts[activeIndex]);
              } else if (query.trim()) {
                event.preventDefault();
                submitSearch(query);
              }
            }
          }}
          ref={inputRef}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isDropdownVisible}
          aria-controls="retevis-search-results"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${visibleProducts[activeIndex]?._id}` : undefined}
          className="h-10 min-w-0 flex-1 border-0 bg-transparent px-3 shadow-none transition-colors duration-150 placeholder:text-slate-400 focus-visible:ring-0 md:text-sm"
        />
        <Button
          type="button"
          aria-label="Бүтээгдэхүүн хайх"
          onClick={() => {
            if (query.trim()) submitSearch(query);
            else {
              setIsDropdownVisible(true);
              inputRef.current?.focus();
            }
          }}
          className="aspect-square h-10 rounded-full bg-yellow p-0 text-gray shadow-none transition duration-150 hover:bg-amber-500 hover:shadow-sm active:scale-95"
        >
          <Image src="/icons/search.svg" alt="" width={21} height={21} priority />
        </Button>
        {query && <button type="button" aria-label="Хайлтыг цэвэрлэх" className="absolute right-[3.5rem] z-10 flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" onClick={() => { setQuery(""); setFilteredProducts([]); setIsDropdownVisible(true); inputRef.current?.focus(); }}>×</button>}
      </div>

      {isDropdownVisible && typeof document !== "undefined" && createPortal(
        <>
          <button
            type="button"
            aria-label="Хайлтын цонхыг хаах"
            tabIndex={-1}
            className="fixed inset-0 z-[100] cursor-default bg-slate-950/25 backdrop-blur-[1px]"
            onClick={() => { setIsDropdownVisible(false); setActiveIndex(-1); }}
          />
          <div
            id="retevis-search-results"
            role="listbox"
            aria-label="Хайлтын санал"
            style={{ top: popoverPosition.top, left: popoverPosition.left, width: popoverPosition.width, maxHeight: popoverPosition.maxHeight }}
            className="fixed z-[103] overscroll-contain overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
        {emptyQuery ? (
          <div className="p-3 sm:p-4">
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Сүүлд хайсан</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((recent) => <button key={recent} type="button" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-slate-900" onMouseDown={(event) => event.preventDefault()} onClick={() => submitSearch(recent)}>{recent}</button>)}
                </div>
              </div>
            )}
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Шинэ бараа</h3>
            {recommendations.isLoading ? (
              <div className="space-y-2" aria-label="Санал болгох барааг ачаалж байна">{Array.from({ length: 3 }, (_, index) => <div key={index} className="flex h-[76px] animate-pulse items-center gap-3"><div className="h-14 w-14 rounded-lg bg-slate-100" /><div className="flex-1 space-y-2"><div className="h-3 w-4/5 rounded bg-slate-100" /><div className="h-3 w-1/2 rounded bg-slate-100" /></div><div className="h-3 w-14 rounded bg-slate-100" /></div>)}</div>
            ) : recommendations.isError ? (
              <div className="py-3 text-center text-sm text-slate-600" role="alert"><p>Санал болгох бараа ачаалсангүй.</p><button type="button" className="mt-2 font-medium text-amber-700 hover:underline" onMouseDown={(event) => event.preventDefault()} onClick={() => void recommendations.refetch()}>Дахин оролдох</button></div>
            ) : visibleProducts.length ? visibleProducts.map(renderProductOption) : (
              <p className="py-4 text-center text-sm text-slate-500">Одоогоор шинэ бараа алга байна.</p>
            )}
          </div>
        ) : isSearching ? (
          <div className="p-4 text-center text-sm text-slate-500" role="status">Хайж байна...</div>
        ) : searchFailed ? (
          <div className="p-4 text-center text-sm" role="alert">
            <p>Хайлт хийх боломжгүй байна.</p>
            <button type="button" className="mt-2 font-medium text-amber-700 hover:underline" onMouseDown={(event) => event.preventDefault()} onClick={() => setRetryCount((count) => count + 1)}>Дахин оролдох</button>
          </div>
        ) : filteredProducts.length ? visibleProducts.map(renderProductOption) : (
          <div className="p-4 text-center text-sm text-slate-500">
            {query.trim().length < 2 ? "Хайлт хийхийн тулд дор хаяж 2 тэмдэгт оруулна уу." : "Хайлтад тохирох бараа олдсонгүй."}
          </div>
        )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default Search;
