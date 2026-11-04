"use client";

import React from "react";
import { useCart } from "@/hooks/useCarts";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const ShopCard = () => {
  const { cartTotalQty } = useCart();

  return (
    <Link href="/cart" aria-label={`Сагс${cartTotalQty > 0 ? `, ${cartTotalQty} бараа` : ""}`} className="relative flex min-h-10 items-center rounded-lg px-2 text-slate-600 transition-colors hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2">
      <div className="flex gap-2 items-center ">
        <ShoppingBag
          className="transition-colors duration-200"
          size={22}
        />
        <span className="hidden text-sm font-medium transition-colors duration-200 lg:block">
          Сагс
        </span>
      </div>

      {cartTotalQty > 0 && (
        <div className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-amber-600 px-1 text-[10px] font-semibold text-white">
          {cartTotalQty}
        </div>
      )}
    </Link>
  );
};

export default ShopCard;
