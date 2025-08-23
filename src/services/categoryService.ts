import { supabase } from '../../lib/supabaseClient';

export interface Category {
  id: number;
  name: string;
  category_type: 'gender' | 'type' | 'style' | 'shape';
  created_at: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      // .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoriesByType = async (categoryType: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_type', categoryType)
      // .order('name');

    if (error) {
      console.error(`Error fetching ${categoryType} categories:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`Error fetching ${categoryType} categories:`, error);
    return [];
  }
}; 