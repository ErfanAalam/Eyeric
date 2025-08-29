import { supabase } from '../../lib/supabaseClient';
import type { Product } from '../types/product';

/**
 * Service for querying products with combined gender-type display orders
 * This demonstrates the power of separate columns vs JSONB for performance
 */

export const getProductsByGenderType = async (
  gender: string, 
  type: string, 
  limit: number = 20
): Promise<Product[]> => {
  // Map gender-type combinations to database columns
  const displayOrderColumn = `${gender}_${type.replace(' ', '_')}_display_order`;
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('gender_category', [gender])
    .contains('type_category', [type])
    .not(displayOrderColumn, 'is', null)
    .order(displayOrderColumn, { ascending: true })
    .limit(limit);

  if (error) {
    console.error(`Error fetching ${gender} ${type} products:`, error);
    return [];
  }

  return data as Product[];
};

// Example: Get men's sunglasses in display order
export const getMensSunglasses = async (limit: number = 20): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('gender_category', ['men'])
    .contains('type_category', ['sunglasses'])
    .not('men_sunglasses_display_order', 'is', null)
    .order('men_sunglasses_display_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching men sunglasses:', error);
    return [];
  }

  return data as Product[];
};

// Example: Get women's eyeglasses in display order
export const getWomensEyeglasses = async (limit: number = 20): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('gender_category', ['women'])
    .contains('type_category', ['eyeglasses'])
    .not('women_eyeglasses_display_order', 'is', null)
    .order('women_eyeglasses_display_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching women eyeglasses:', error);
    return [];
  }

  return data as Product[];
};

// Example: Get products for multiple gender-type combinations
export const getProductsForMultipleCategories = async (
  combinations: Array<{ gender: string; type: string }>,
  limit: number = 20
): Promise<Product[]> => {
  // Build complex query with multiple display order conditions

  // Build complex query with multiple display order conditions
  const conditions = combinations.map(({ gender, type }) => {
    const column = `${gender}_${type.replace(' ', '_')}_display_order`;
    return { column, gender, type };
  });

  // This is where separate columns shine - we can build complex OR conditions
  const orConditions = conditions.map(({ column, gender, type }) => 
    `(gender_category @> '["${gender}"]' AND type_category @> '["${type}"]' AND ${column} IS NOT NULL)`
  ).join(' OR ');

  // For now, we'll use a simpler approach, but this shows the potential
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(orConditions)
    .limit(limit);

  if (error) {
    console.error('Error fetching products for multiple categories:', error);
    return [];
  }

  // Sort by the appropriate display order for each product
  const sortedData = (data as Product[]).sort((a, b) => {
    // Find the relevant display order for each product
    const aOrder = getDisplayOrderForProduct(a, combinations);
    const bOrder = getDisplayOrderForProduct(b, combinations);
    
    if (aOrder === null && bOrder === null) return 0;
    if (aOrder === null) return 1;
    if (bOrder === null) return -1;
    
    return aOrder - bOrder;
  });

  return sortedData;
};

// Helper function to get the appropriate display order for a product
const getDisplayOrderForProduct = (
  product: Product, 
  combinations: Array<{ gender: string; type: string }>
): number | null => {
  for (const { gender, type } of combinations) {
    const column = `${gender}_${type.replace(' ', '_')}_display_order` as keyof Product;
    const displayOrder = product[column] as number | undefined;
    
    if (displayOrder !== undefined && displayOrder !== null) {
      return displayOrder;
    }
  }
  return null;
};

// Example: Get products for a specific page (e.g., men's page)
export const getProductsForGenderPage = async (
  gender: string,
  limit: number = 20
): Promise<Product[]> => {
  // This query shows how we can efficiently get products for a gender page
  // by ordering by the most relevant display order
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('gender_category', [gender])
    .or(`mens_${gender}_display_order IS NOT NULL, womens_${gender}_display_order IS NOT NULL, kids_${gender}_display_order IS NOT NULL`)
    .limit(limit);

  if (error) {
    console.error(`Error fetching ${gender} page products:`, error);
    return [];
  }

  // Sort by the appropriate display order for each product
  const sortedData = (data as Product[]).sort((a, b) => {
    const aOrder = getGenderDisplayOrder(a, gender);
    const bOrder = getGenderDisplayOrder(b, gender);
    
    if (aOrder === null && bOrder === null) return 0;
    if (aOrder === null) return 1;
    if (bOrder === null) return -1;
    
    return aOrder - bOrder;
  });

  return sortedData;
};

// Helper function to get gender-specific display order
const getGenderDisplayOrder = (product: Product, gender: string): number | null => {
  const column = `${gender}_display_order` as keyof Product;
  return product[column] as number | null;
}; 