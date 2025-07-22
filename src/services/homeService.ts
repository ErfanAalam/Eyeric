import { Slide, CategoryData, Brand, BestSeller, Shape, ProductType, Feature, ProductCategory } from "../types/data";
import { supabase } from '../../lib/supabaseClient';
import { Product } from '../app/admin/dashboard/tabs/ManageProductTab';

// These functions would be replaced with actual database calls
export const getHeroSlides = async (): Promise<Slide[]> => {
  // Example database call:
  // const response = await fetch('/api/hero-slides');
  // return response.json();
  return [];
};

export const getCategoryData = async (): Promise<CategoryData> => {
  // Example database call:
  // const response = await fetch('/api/categories');
  // return response.json();
  return {};
};

export const getBrands = async (): Promise<Brand[]> => {
  // Example database call:
  // const response = await fetch('/api/brands');
  // return response.json();
  return [];
};

export const getBestSellers = async (): Promise<BestSeller[]> => {
  // Example database call:
  // const response = await fetch('/api/best-sellers');
  // return response.json();
  return [];
};

export const getShapes = async (): Promise<Shape[]> => {
  // Example database call:
  // const response = await fetch('/api/shapes');
  // return response.json();
  return [];
};

export const getProductTypes = async (): Promise<ProductType[]> => {
  // Example database call:
  // const response = await fetch('/api/product-types');
  // return response.json();
  return [];
};

export const getFeatures = async (): Promise<Feature[]> => {
  // Example database call:
  // const response = await fetch('/api/features');
  // return response.json();
  return [];
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  // Example database call:
  // const response = await fetch('/api/product-categories');
  // return response.json();
  return [];
};

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as Product[];
};

export const getSlides = async () => {
  const { data, error } = await supabase
    .from('slide')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
  return data;
};

export const getCategoryBanners = async () => {
  const { data, error } = await supabase
    .from('category_banners')
    .select('*');
  if (error) {
    console.error('Error fetching category banners:', error);
    return [];
  }
  return data;
};

export const getShapeBanners = async () => {
  const { data, error } = await supabase
    .from('shape_banners')
    .select('*');
  if (error) {
    console.error('Error fetching shape banners:', error);
    return [];
  }
  return data;
};

// Fetch lenses by lens_category_id
export const getLensesByCategory = async (lens_category_id: number) => {
  const { data, error } = await supabase
    .from('lenses')
    .select('*')
    .eq('lens_category_id', lens_category_id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching lenses:', error);
    return [];
  }
  return data;
}; 