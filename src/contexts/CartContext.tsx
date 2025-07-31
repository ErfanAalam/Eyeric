'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

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

export interface CartItem {
  product: Product;
  lens?: Lens;
  powerCategory?: string;
  quantity?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isInCart: (item: CartItem) => boolean;
  removeByDetails: (item: CartItem) => void;
  updateQuantity: (index: number, quantity: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { userProfile } = useAuth();
  const router = useRouter();

  // Fetch cart from user table on mount if logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (userProfile) {
        const { data } = await supabase
          .from('user')
          .select('cart_items')
          .eq('id', userProfile.id)
          .single();
        if (data && data.cart_items) {
          setCartItems(data.cart_items);
        }
      }
    };
    fetchCart();
  }, [userProfile]);

  // Update user table when cart changes (if logged in)
  useEffect(() => {
    const updateCart = async () => {
      if (userProfile) {
        await supabase
          .from('user')
          .update({ cart_items: cartItems })
          .eq('id', userProfile.id);
      }
    };
    if (userProfile) updateCart();
  }, [cartItems, userProfile]);

  // Add to cart with auth check
  const addToCart = (item: CartItem) => {
    if (!userProfile) {
      router.push('/login');
      return;
    }
    setCartItems(prev => {
      // Check if item already exists in cart
      const existingIndex = prev.findIndex(cartItem =>
        cartItem.product.id === item.product.id &&
        (item.lens ? cartItem.lens?.id === item.lens.id : !cartItem.lens) &&
        (item.powerCategory ? cartItem.powerCategory === item.powerCategory : !cartItem.powerCategory)
      );
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        return prev.map((cartItem, index) =>
          index === existingIndex 
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + (item.quantity || 1) }
            : cartItem
        );
      } else {
        // Add new item if it doesn't exist
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (index: number) => {
    if (!userProfile) {
      router.push('/login');
      return;
    }
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    if (!userProfile) {
      router.push('/login');
      return;
    }
    setCartItems([]);
  };

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
    if (!userProfile) {
      router.push('/login');
      return;
    }
    setCartItems(prev => prev.filter(cartItem =>
      !(
        cartItem.product.id === item.product.id &&
        (item.lens ? cartItem.lens?.id === item.lens.id : !cartItem.lens) &&
        (item.powerCategory ? cartItem.powerCategory === item.powerCategory : !cartItem.powerCategory)
      )
    ));
  };

  // Update quantity of a cart item
  const updateQuantity = (index: number, quantity: number) => {
    if (!userProfile) {
      router.push('/login');
      return;
    }
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: quantity || 1 } : item
    ));
  };

  // Calculate total cart value
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const productPrice = item.product.discounted_price || item.product.original_price || 0;
      const lensPrice = item.lens?.original_price || 0;
      return total + (productPrice + lensPrice) * (item.quantity || 1);
    }, 0);
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      isInCart, 
      removeByDetails,
      updateQuantity,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}; 