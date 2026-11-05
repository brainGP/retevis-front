"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "@/types/Product";
import { toast } from "sonner";

const STORAGE_KEY = "Retevis";
const MAX_SELECTED_QTY = 99;

function readPrice(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : undefined;
  if (typeof value !== "string") return undefined;
  const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: Product[];
  handleAddProductToCart: (product: Product) => void;
  handleRemoveProductFromCart: (product: Product) => void;
  handleCartQtyIncrease: (product: Product) => void;
  handleCartQtyDecrease: (product: Product) => void;
  handleClearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

function readSavedCart(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const products = new Map<string, Product>();
    for (const item of parsed) {
      if (!item || typeof item !== "object" || typeof item._id !== "string" || typeof item.name !== "string") continue;
      const product = item as Product;
      const quantity = Math.min(MAX_SELECTED_QTY, Math.max(1, Math.floor(Number(product.quantity) || 1)));
      const priceN = readPrice(product.priceN) ?? readPrice(product.price);
      const previous = products.get(product._id);
      products.set(product._id, {
        ...product,
        quantity: Math.min(MAX_SELECTED_QTY, quantity + (previous?.quantity || 0)),
        ...(priceN === undefined ? {} : { priceN }),
        images: Array.isArray(product.images) ? product.images : [],
      });
    }
    return [...products.values()];
  } catch {
    return [];
  }
}

export const CartContextProvider: React.FC<Props> = ({ children }) => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setCartProducts(readSavedCart());
    setIsHydrated(true);

    const syncOtherTab = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setCartProducts(readSavedCart());
    };
    window.addEventListener("storage", syncOtherTab);
    return () => window.removeEventListener("storage", syncOtherTab);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartProducts));
    } catch {
      toast.error("Сонгосон барааг хадгалж чадсангүй.");
    }
  }, [cartProducts, isHydrated]);

  const { qty: cartTotalQty, total: cartTotalAmount } = useMemo(() => cartProducts.reduce(
    (totals, product) => {
      const quantity = Math.max(0, Number(product.quantity) || 0);
      totals.qty += quantity;
      totals.total += (Number(product.priceN) || 0) * quantity;
      return totals;
    },
    { qty: 0, total: 0 },
  ), [cartProducts]);

  const handleAddProductToCart = useCallback((product: Product) => {
    const incomingQty = Math.min(MAX_SELECTED_QTY, Math.max(1, Math.floor(Number(product.quantity) || 1)));
    const normalizedPrice = readPrice(product.priceN) ?? readPrice(product.price);
    const normalizedProduct = normalizedPrice === undefined ? product : { ...product, priceN: normalizedPrice };
    setCartProducts((previous) => {
      const index = previous.findIndex((item) => item._id === product._id);
      if (index < 0) return [...previous, { ...normalizedProduct, quantity: incomingQty }];

      return previous.map((item, itemIndex) => itemIndex === index
        ? { ...normalizedProduct, quantity: Math.min(MAX_SELECTED_QTY, item.quantity + incomingQty) }
        : item,
      );
    });
    toast.success("Барааг лавлах жагсаалтад нэмлээ.");
  }, []);

  const handleRemoveProductFromCart = useCallback((product: Product) => {
    setCartProducts((previous) => previous.filter((item) => item._id !== product._id));
    toast.success("Барааг жагсаалтаас хаслаа.");
  }, []);

  const handleCartQtyIncrease = useCallback((product: Product) => {
    if (product.quantity >= MAX_SELECTED_QTY) {
      toast.error(`Нэг бараанаас ${MAX_SELECTED_QTY}-аас олон сонгох боломжгүй.`);
      return;
    }
    setCartProducts((previous) => previous.map((item) => item._id === product._id
      ? { ...item, quantity: Math.min(MAX_SELECTED_QTY, item.quantity + 1) }
      : item,
    ));
  }, []);

  const handleCartQtyDecrease = useCallback((product: Product) => {
    if (product.quantity <= 1) return;
    setCartProducts((previous) => previous.map((item) => item._id === product._id
      ? { ...item, quantity: Math.max(1, item.quantity - 1) }
      : item,
    ));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartProducts([]);
    toast.success("Лавлах жагсаалтыг цэвэрлэлээ.");
  }, []);

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) throw new Error("useCart must be used within a CartContextProvider");
  return context;
};
