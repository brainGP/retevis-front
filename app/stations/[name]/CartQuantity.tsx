"use client";

import React from "react";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";

interface SetQtyProps {
  cartCounter?: boolean;
  cartProduct: Product;
  maxQuantity?: number;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

const SetQuantity: React.FC<SetQtyProps> = ({
  cartCounter,
  cartProduct,
  maxQuantity = 99,
  handleQtyDecrease,
  handleQtyIncrease,
}) => {
  return (
    <div className="flex items-center gap-4 py-4">
      {!cartCounter && <div className="font-semibold">Тоо хэмжээ:</div>}
      <div className="flex items-center gap-3 text-base">
        <Button
          type="button"
          onClick={handleQtyDecrease}
          disabled={cartProduct.quantity <= 1}
          aria-label="Тоо ширхэг хасах"
          className="h-9 w-9 border border-slate-200 bg-white p-0 text-slate-700 shadow-none hover:bg-slate-50 disabled:opacity-40"
        >
          -
        </Button>
        <output aria-live="polite" aria-label="Сонгосон тоо ширхэг" className="min-w-6 text-center font-semibold tabular-nums text-slate-900">{cartProduct.quantity}</output>
        <Button
          type="button"
          onClick={handleQtyIncrease}
          disabled={cartProduct.quantity >= maxQuantity}
          aria-label="Тоо ширхэг нэмэх"
          className="h-9 w-9 border border-slate-200 bg-white p-0 text-slate-700 shadow-none hover:bg-slate-50 disabled:opacity-40"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default SetQuantity;
