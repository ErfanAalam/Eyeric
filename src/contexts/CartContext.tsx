'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

// Import PowerDetails interface
export interface PowerDetails {
  samePower: boolean;
  leftSPH: string;
  rightSPH: string;
  leftCYL: string;
  rightCYL: string;
  leftAxis: string;
  rightAxis: string;
  leftAddlPower: string;
  rightAddlPower: string;
  lensCategory?: string;
}

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
  images: { url: string; display_order: number }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category: string;
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
  product_serial_number?: string;
  frame_colour?: string;
  temple_colour?: string;
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
  powerDetails?: PowerDetails | null;
  prescriptionImageUrl?: string | null;
  powerMethod?: string;
  powerName?: string;
  powerPhone?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartLoading: boolean;
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
  const [cartLoading, setCartLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch cart from user table on mount if logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (userProfile && !hasInitialized) {
        try {
          setCartLoading(true);
          console.log('Fetching cart for user:', userProfile.id);
          
          const { data, error } = await supabase
            .from('user')
            .select('cart_items')
            .eq('id', userProfile.id)
            .single();
          
          if (error) {
            console.error('Error fetching cart from database:', error);
            // If the column doesn't exist, start with empty cart
            console.log('Cart column may not exist, starting with empty cart');
            setCartItems([]);
          } else if (data && data.cart_items) {
            console.log('Cart loaded from database:', data.cart_items);
            setCartItems(data.cart_items);
          } else {
            console.log('No cart items found in database, starting with empty cart');
            setCartItems([]);
          }
          setHasInitialized(true);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCartItems([]);
          setHasInitialized(true);
        } finally {
          setCartLoading(false);
        }
      } else if (!userProfile && !authLoading) {
        // User is not logged in and auth is not loading
        console.log('User not logged in, clearing cart');
        setCartItems([]);
        setHasInitialized(true);
        setCartLoading(false);
      }
    };
    
    fetchCart();
  }, [userProfile, authLoading, hasInitialized]);

  // Update database when cart changes
  useEffect(() => {
    const updateCart = async () => {
      if (userProfile && hasInitialized && !cartLoading) {
        try {
          console.log('Updating cart in database for user:', userProfile.id, 'Items:', cartItems);
          const { error } = await supabase
            .from('user')
            .update({ cart_items: cartItems })
            .eq('id', userProfile.id);
          
          if (error) {
            console.error('Error updating cart in database:', error);
            // Don't throw error, just log it
            // The cart will still work in memory until page refresh
          } else {
            console.log('Cart updated successfully in database');
          }
        } catch (error) {
          console.error('Error updating cart:', error);
          // Don't throw error, just log it
        }
      }
    };
    
    if (hasInitialized && !cartLoading) {
      updateCart();
    }
  }, [cartItems, userProfile, hasInitialized, cartLoading]);

  // Add to cart with auth check
  const addToCart = (item: CartItem) => {
    if (!userProfile) {
      router.push('/login');
      return;
    }
    
    if (cartLoading) {
      console.log('Cart is still loading, cannot add item');
      return;
    }

    // const error = supabase.from('user').update({ cart_items: cartItems }).eq('id', userProfile.id);
    // if (error) {
    //   console.error('Error updating cart in database:', error);
    // }
    
    console.log('Adding item to cart:', item);
    setCartItems(prev => {
      // Check if item already exists in cart
      const existingIndex = prev.findIndex(cartItem =>
        cartItem.product.id === item.product.id &&
        (item.lens ? cartItem.lens?.id === item.lens.id : !cartItem.lens) &&
        (item.powerCategory ? cartItem.powerCategory === item.powerCategory : !cartItem.powerCategory)
      );
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        const error = supabase.from('user').update({ cart_items: prev }).eq('id', userProfile.id);
        if (error) {
          console.error('Error updating cart in database:', error);
        }
        const updatedCart = prev.map((cartItem, index) =>
          index === existingIndex 
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + (item.quantity || 1) }
            : cartItem
        );
        
        // console.log('Updated existing item in cart:', updatedCart);
        router.push('/cart');
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        const error = supabase.from('user').update({ cart_items: cartItems }).eq('id', userProfile.id);
        if (error) {
          console.error('Error updating cart in database:', error);
        }
        const newCart = [...prev, { ...item, quantity: item.quantity || 1 }];
        console.log('Added new item to cart:', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (index: number) => {
    if (!userProfile) {
      router.push('/login');
      return;
    }
    
    if (cartLoading) {
      console.log('Cart is still loading, cannot remove item');
      return;
    }
    
    console.log('Removing item from cart at index:', index);
    const error = supabase.from('user').delete().eq('id', userProfile.id);
    if (error) {
      console.error('Error deleting cart in database:', error);
    }
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    if (!userProfile) {
      router.push('/login');
      return;
    }
    
    if (cartLoading) {
      console.log('Cart is still loading, cannot clear cart');
      return;
    }
    
    const error = supabase.from('user').delete();
    if (error) {
      console.error('Error deleting cart in database:', error);
    }

    console.log('Clearing cart');
    setCartItems([]);
  };

  // Check if a product (with optional lens and powerCategory) is already in the cart
  const isInCart = (item: CartItem) => {
    if (cartLoading) return false;
    
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
    
    if (cartLoading) {
      console.log('Cart is still loading, cannot remove item');
      return;
    }
    
    console.log('Removing item by details:', item);
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
    
    if (cartLoading) {
      console.log('Cart is still loading, cannot update quantity');
      return;
    }
    
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    console.log('Updating quantity at index:', index, 'to:', quantity);
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
      cartLoading,
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