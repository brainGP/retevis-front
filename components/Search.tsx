"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ProductImage from "@/components/ProductImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Product } from "@/types/Product";
import { searchProducts } from "@/apis/products";
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
  const requestId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("retevis.recentSearches") || "[]");
      if (Array.isArray(saved)) setRecentSearches(saved.filter((item) => typeof item === "string").slice(0, 5));
    } catch { /* Ignore malformed local UI state. */ }
  }, []);

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
    return <>{text.slice(0, start)}<mark className="rounded bg-yellow/60">{text.slice(start, start + term.length)}</mark>{text.slice(start + term.length)}</>;
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
    setIsDropdownVisible(!!value);
      setActiveIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => setIsDropdownVisible(false), 200);
  };

  return (
    <div className="relative w-full max-w-2xl text-gray">
      <div className="flex w-full items-center rounded-full gap-4">
        <Input
          type="search"
          placeholder="Хайлт хийх..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && filteredProducts.length) {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % filteredProducts.length);
            } else if (event.key === "ArrowUp" && filteredProducts.length) {
              event.preventDefault();
              setActiveIndex((index) => index <= 0 ? filteredProducts.length - 1 : index - 1);
            } else if (event.key === "Escape") {
              setIsDropdownVisible(false);
              setActiveIndex(-1);
            } else if (event.key === "Enter" && query.trim()) {
              event.preventDefault();
              if (activeIndex >= 0 && filteredProducts[activeIndex]) {
                router.push(`/stations/${encodeURIComponent(filteredProducts[activeIndex].name)}`);
                setIsDropdownVisible(false);
              } else submitSearch(query);
            }
          }}
          ref={inputRef}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isDropdownVisible}
          aria-controls="retevis-search-results"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${filteredProducts[activeIndex]?._id}` : undefined}
          className="px-4 h-10 transition-all duration-300"
        />
        <Button
          type="button"
          aria-label="Бүтээгдэхүүн хайх"
          onClick={() => query.trim() && router.push(`/stations?q=${encodeURIComponent(query.trim())}`)}
          className="rounded-md bg-yellow hover:bg-yellow/60 flex items-center justify-center p-0 aspect-square"
        >
          <Image
            src="/icons/search.svg"
            alt="Search Icon"
            width={24}
            height={24}
            priority={true}
          />
        </Button>
        {query && <button type="button" aria-label="Хайлтыг цэвэрлэх" className="absolute right-12 z-10 px-2 text-lg" onClick={() => { setQuery(""); setFilteredProducts([]); setIsDropdownVisible(true); inputRef.current?.focus(); }}>×</button>}
      </div>

      <div
        id="retevis-search-results"
        role="listbox"
        className={`absolute left-0 right-0 mt-2 bg-white border border-gray rounded-lg max-h-64 shadow-lg overflow-y-auto z-10 transition-all duration-300 transform ${
          isDropdownVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {isSearching ? (
          <div className="p-4 text-center text-sm">Хайж байна...</div>
        ) : searchFailed ? (
          <div className="p-4 text-center text-sm" role="alert">
            <p>Хайлт хийх боломжгүй байна.</p>
            <button className="mt-2 underline" onMouseDown={(event) => event.preventDefault()} onClick={() => setRetryCount((count) => count + 1)}>Дахин оролдох</button>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <button
              key={product._id}
              id={`search-option-${product._id}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              className={`w-full text-left flex justify-between items-center px-4 py-2 hover:bg-transparent/10 h-32 cursor-pointer border-b ${activeIndex === index ? "bg-gray-100" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => { setIsDropdownVisible(false); router.push(`/stations/${encodeURIComponent(product.name)}`); }}
            >
              <div className="flex items-center gap-4">
                <ProductImage
                  src={product.images?.[0]?.image}
                  alt={product.name || "Product Image"}
                  width={80}
                  height={80}
                  className="object-contain max-w-[200px] max-h-[100px]"
                  priority={true}
                />
                <div>
                  <span className="font-semibold text-sm block">
                    {highlight(product.name, query)}
                  </span>
                  <span className="text-xs text-gray-600">{product.style}</span>
                </div>
              </div>
              <div className="font-medium text-gray whitespace-nowrap mr-6">
                {formatPrice(product.priceN)}₮
              </div>
            </button>
          ))
        ) : (
          <div className="p-4 text-center text-sm">
            {query.trim().length < 2 ? <span>Хайлт хийхийн тулд дор хаяж 2 тэмдэгт оруулна уу.</span> : <span>Хайлт олдсонгүй</span>}
            {!query.trim() && recentSearches.length > 0 && <div className="mt-2 flex flex-wrap justify-center gap-2">{recentSearches.map((recent) => <button key={recent} className="rounded-full border px-3 py-1" onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(recent); submitSearch(recent); }}>{recent}</button>)}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
