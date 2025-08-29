"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  product_serial_number?: string;
  frame_colour?: string;
  temple_colour?: string;
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

// Local storage key for favorites
const LOCAL_STORAGE_FAVORITES_KEY = 'eyeric_favorites';

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

  // Load favorites from localStorage
  const loadFavoritesFromLocalStorage = useCallback(() => {
    try {
      const storedFavorites = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        return Array.isArray(parsedFavorites) ? parsedFavorites : [];
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
    return [];
  }, []);

  // Save favorites to localStorage
  const saveFavoritesToLocalStorage = useCallback((favoritesList: Product[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favoritesList));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, []);

  // Sync localStorage favorites to database when user logs in
  const syncLocalFavoritesToDatabase = useCallback(async () => {
    if (!user) return;

    try {
      const localFavorites = loadFavoritesFromLocalStorage();
      if (localFavorites.length === 0) return;

      console.log('Syncing local favorites to database:', localFavorites.length, 'items');

      // Get current database favorites
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('favorite_products')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user favorites for sync:', userError);
        return;
      }

      // Merge local favorites with database favorites (avoid duplicates)
      const databaseFavorites = userData?.favorite_products || [];
      const mergedFavorites = [...databaseFavorites];
      
      localFavorites.forEach(localProduct => {
        if (!mergedFavorites.some(dbProduct => dbProduct.id === localProduct.id)) {
          mergedFavorites.push(localProduct);
        }
      });

      // Update database with merged favorites
      const { error: updateError } = await supabase
        .from('user')
        .update({ favorite_products: mergedFavorites })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error syncing local favorites to database:', updateError);
      } else {
        console.log('Successfully synced local favorites to database');
        // Clear localStorage after successful sync
        localStorage.removeItem(LOCAL_STORAGE_FAVORITES_KEY);
        // Update local state with merged favorites
        setFavorites(mergedFavorites);
      }
    } catch (error) {
      console.error('Error syncing local favorites to database:', error);
    }
  }, [user, loadFavoritesFromLocalStorage]);

  const loadFavoritesFromDatabase = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      // console.log('Loading favorites from database for user:', user.id);
      
      // Get user's favorites from database
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('favorite_products')
        .eq('id', user.id)
        .single();

      // console.log('User data result:', { userData, userError });

      if (userError) {
        console.error('Error fetching user favorites:', userError);
        setFavorites([]);
        return;
      }

      if (userData?.favorite_products) {
        // console.log('Found favorites in user table:', userData.favorite_products);
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
  }, [user]);

  // Load favorites from localStorage when user is not logged in
  const loadFavoritesFromLocalStorageState = useCallback(() => {
    if (!user) {
      const localFavorites = loadFavoritesFromLocalStorage();
      setFavorites(localFavorites);
      setLoading(false);
    }
  }, [user, loadFavoritesFromLocalStorage]);

  // Load favorites from database when user logs in
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    
    if (user) {
      // User is logged in, sync local favorites first, then load from database
      syncLocalFavoritesToDatabase().then(() => {
        loadFavoritesFromDatabase();
      });
    } else {
      // User is not logged in, load from localStorage
      loadFavoritesFromLocalStorageState();
    }
  }, [user, authLoading, syncLocalFavoritesToDatabase, loadFavoritesFromDatabase, loadFavoritesFromLocalStorageState]);

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
    try {
      console.log('Adding product to favorites:', product.title);
      const newFavorites = [...favorites, product];
      setFavorites(newFavorites);
      
      if (user) {
        // User is logged in, save to database
        await updateFavoritesInDatabase(newFavorites);
        console.log('Successfully added to favorites in database');
      } else {
        // User is not logged in, save to localStorage
        saveFavoritesToLocalStorage(newFavorites);
        console.log('Successfully added to favorites in localStorage');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      console.log('Removing product from favorites:', productId);
      const newFavorites = favorites.filter(product => product.id !== productId);
      setFavorites(newFavorites);
      
      if (user) {
        // User is logged in, update database
        await updateFavoritesInDatabase(newFavorites);
        console.log('Successfully removed from favorites in database');
      } else {
        // User is not logged in, update localStorage
        saveFavoritesToLocalStorage(newFavorites);
        console.log('Successfully removed from favorites in localStorage');
      }
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
    } else {
      loadFavoritesFromLocalStorageState();
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