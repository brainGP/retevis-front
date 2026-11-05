"use client";

import { CartContextProvider } from "@/hooks/useCarts";
import { MessengerInquiryProvider } from "@/components/MessengerInquiry";
import React from "react";

interface CartProviderProps {
  children: React.ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  return (
    <CartContextProvider>
      <MessengerInquiryProvider>{children}</MessengerInquiryProvider>
    </CartContextProvider>
  );
};

export default CartProvider;
