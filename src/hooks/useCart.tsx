import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  selectedVariant?: string;
  [key: string]: any;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: string) => void;
  clearCart: () => void;
  isInCart: (id: string, variant?: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("atc_cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("atc_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const key = `${item.id}-${item.selectedVariant ?? ""}`;
      if (prev.find((i) => `${i.id}-${i.selectedVariant ?? ""}` === key)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string, variant?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && (i.selectedVariant ?? "") === (variant ?? "")))
    );
  };

  const clearCart = () => setItems([]);

  const isInCart = (id: string, variant?: string) =>
    items.some((i) => i.id === id && (i.selectedVariant ?? "") === (variant ?? ""));

  return (
    <CartContext.Provider
      value={{ items, itemCount: items.length, addItem, removeItem, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
