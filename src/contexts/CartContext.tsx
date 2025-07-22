'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define Product and Lens types
interface Product {
  id?: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  display_order?: number;
  bestseller?: boolean;
  latest_trend?: boolean;
  banner_image_1?: string;
  banner_image_2?: string;
  colors: ({ color: string; images: string[] } | { colors: string[]; images: string[] })[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category?: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
  is_lens_used?: boolean;
  lens_category_id?: number;
}

interface Lens {
  id: string;
  image_url: string;
  title: string;
  description: string;
  features: string[];
  original_price: number;
  category: string;
  lens_category_id: number;
}

interface CartItem {
  product: Product;
  lens?: Lens;
  powerCategory?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isInCart: (item: CartItem) => boolean;
  removeByDetails: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => setCartItems(prev => [...prev, item]);
  const removeFromCart = (index: number) => setCartItems(prev => prev.filter((_, i) => i !== index));
  const clearCart = () => setCartItems([]);

  // Check if a product (with optional lens and powerCategory) is already in the cart
  const isInCart = (item: CartItem) => {
    return cartItems.some(cartItem =>
      cartItem.product.id === item.product.id &&
      (item.lens ? cartItem.lens?.id === item.lens.id : !cartItem.lens) &&
      (item.powerCategory ? cartItem.powerCategory === item.powerCategory : !cartItem.powerCategory)
    );
  };

  // Remove by product id, lens id, and powerCategory
  const removeByDetails = (item: CartItem) => {
    setCartItems(prev => prev.filter(cartItem =>
      !(
        cartItem.product.id === item.product.id &&
        (item.lens ? cartItem.lens?.id === item.lens.id : !cartItem.lens) &&
        (item.powerCategory ? cartItem.powerCategory === item.powerCategory : !cartItem.powerCategory)
      )
    ));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isInCart, removeByDetails }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}; 