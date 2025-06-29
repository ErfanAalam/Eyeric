"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from './AuthContext';

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
  colors: { color: string; images: string[] }[];
  sizes: string[];
  frame_material?: string;
  features: string[];
  shape_category?: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
}

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
  isLoggedIn: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Load favorites from database when user logs in
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    if (user) {
      console.log('User logged in, loading favorites for user:', user.id);
      loadFavoritesFromDatabase();
    } else {
      console.log('User logged out, clearing favorites');
      // Clear favorites when user logs out
      setFavorites([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadFavoritesFromDatabase = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading favorites from database for user:', user.id);
      
      // Get user's favorites from database
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('favorite_products')
        .eq('id', user.id)
        .single();

      console.log('User data result:', { userData, userError });

      if (userError) {
        console.error('Error fetching user favorites:', userError);
        setFavorites([]);
        return;
      }

      if (userData?.favorite_products) {
        console.log('Found favorites in user table:', userData.favorite_products);
        setFavorites(userData.favorite_products);
      } else {
        console.log('No favorites found in user table');
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites from database:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFavoritesInDatabase = async (favoritesList: Product[]) => {
    if (!user) return;

    try {
      console.log('Updating favorites in database for user:', user.id, 'Favorites:', favoritesList);
      
      // Update the user table with the new favorites array
      const { data,error } = await supabase
        .from('user')
        .update({ favorite_products: favoritesList })
        .eq('id', user.id)
        .select();

    console.log('Supabase update result:', { data, error });


      if (error) {
        console.error('Error updating favorites in user table:', error);
      } else {
        console.log('Successfully updated favorites in user table');
      }
    } catch (error) {
      console.error('Error updating favorites in database:', error);
    }
  };

  const addToFavorites = async (product: Product) => {
    if (!user) {
      throw new Error('User must be logged in to add favorites');
    }

    try {
      console.log('Adding product to favorites:', product.title, 'for user:', user.id);
      const newFavorites = [...favorites, product];
      setFavorites(newFavorites);
      await updateFavoritesInDatabase(newFavorites);
      console.log('Successfully added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) {
      throw new Error('User must be logged in to remove favorites');
    }

    try {
      console.log('Removing product from favorites:', productId, 'for user:', user.id);
      const newFavorites = favorites.filter(product => product.id !== productId);
      setFavorites(newFavorites);
      await updateFavoritesInDatabase(newFavorites);
      console.log('Successfully removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(product => product.id === productId);
  };

  const refreshFavorites = async () => {
    if (user) {
      await loadFavoritesFromDatabase();
    }
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount: favorites.length,
    loading,
    refreshFavorites,
    isLoggedIn: !!user
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}; 