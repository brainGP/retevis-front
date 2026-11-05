"use client";

import React from "react";
import { useCart } from "@/hooks/useCarts";
import { MessageCircle } from "lucide-react";
import { useOpenMessengerInquiry } from "@/components/MessengerInquiry";

const ShopCard = () => {
  const { cartTotalQty } = useCart();
  const openInquiry = useOpenMessengerInquiry();

  return (
    <button type="button" onClick={openInquiry} aria-haspopup="dialog" aria-label={`Лавлах жагсаалт нээх${cartTotalQty > 0 ? `, ${cartTotalQty} бараа` : ""}`} className="relative flex min-h-10 items-center rounded-lg px-2 text-slate-600 transition-colors hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2">
      <div className="flex gap-2 items-center ">
        <MessageCircle
          className="transition-colors duration-200"
          size={22}
        />
        <span className="hidden text-sm font-medium transition-colors duration-200 lg:block">
          Лавлах
        </span>
      </div>

      {cartTotalQty > 0 && (
        <div className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-amber-600 px-1 text-[10px] font-semibold text-white">
          {cartTotalQty}
        </div>
      )}
    </button>
  );
};

export default ShopCard;
