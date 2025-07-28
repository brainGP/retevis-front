"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Product } from "@/types/Product";
import { toast } from "sonner";
import { getProducts } from "@/apis/products";
import { formatPrice } from "@/utils/formatPrice";

const Search = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          toast.error("Бүтээгдэхүүнийг авч чадсангүй");
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch {
        toast.error("Бүтээгдэхүүнийг татахад алдаа гарсан");
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);

    if (value && Array.isArray(products)) {
      const results = products.filter((product) =>
        ["name", "brand", "sort", "type", "style"].some((key) => {
          const valueToCheck = (product[key as keyof Product] || "").toString();
          return valueToCheck.toLowerCase().includes(value);
        })
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }

    setIsDropdownVisible(!!value);
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
          className="px-4 h-10 transition-all duration-300"
        />
        <Button
          type="submit"
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
      </div>

      <div
        className={`absolute left-0 right-0 mt-2 bg-white border border-gray rounded-lg max-h-64 shadow-lg overflow-y-auto z-10 transition-all duration-300 transform ${
          isDropdownVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex justify-between items-center px-4 py-2 hover:bg-transparent/10 h-32 cursor-pointer border-b"
              onClick={() => router.push(`/stations/${product.name}`)}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={product.images[0]?.image || "/placeholder.png"}
                  alt={product.name || "Product Image"}
                  width={80}
                  height={80}
                  className="object-contain max-w-[200px] max-h-[100px]"
                  priority={true}
                />
                <div>
                  <span className="font-semibold text-sm block">
                    {product.name}
                  </span>
                  <span className="text-xs text-gray-600">{product.style}</span>
                </div>
              </div>
              <div className="font-medium text-gray whitespace-nowrap mr-6">
                {formatPrice(product.priceN)}₮
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-sm">
            <span>Хайлт олдсонгүй</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
