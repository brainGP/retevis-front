"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCarts";
import { ShoppingBag } from "lucide-react";

const ShopCard = () => {
  const router = useRouter();
  const { cartTotalQty } = useCart();

  return (
    <div
      className="relative cursor-pointer group text-zinc-600 px-2"
      onClick={() => router.push(`/cart`)}
    >
      <div className="flex gap-2 items-center ">
        <ShoppingBag
          className=" group-hover:text-yellow transition-colors duration-200"
          size={24}
        />
        <span className="hidden lg:block text-sm font-medium group-hover:text-yellow transition-colors duration-200">
          Сагс
        </span>
      </div>

      {cartTotalQty > 0 && (
        <div className="absolute top-[-10px] right-[-16px] bg-yellow text-white h-5 w-5 rounded-full flex justify-center items-center text-xs">
          {cartTotalQty}
        </div>
      )}
    </div>
  );
};

export default ShopCard;
