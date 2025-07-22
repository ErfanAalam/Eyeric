'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  product: any;
  lens?: any;
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