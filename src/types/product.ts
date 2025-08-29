export type Product = {
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
  shape_category?: string;
  tags: string[];
  gender_category: string[];
  type_category: string[];
  created_at?: string;
  updated_at?: string;
  is_lens_used?: boolean;
  quantity?: number;
  style_category?: string;
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
  lens_category_id?: number;
  is_active?: boolean;
  product_serial_number?: string;
  frame_colour?: string;
  temple_colour?: string;
  special_product_categories?: string[];
  
  // Individual display orders (legacy - can be removed later)
  mens_display_order?: number;
  womens_display_order?: number;
  kids_display_order?: number;
  sunglasses_display_order?: number;
  eyeglasses_display_order?: number;
  computerglasses_display_order?: number;
  powered_sunglasses_display_order?: number;
  
  // Combined gender-type display orders (new)
  men_sunglasses_display_order?: number;
  men_eyeglasses_display_order?: number;
  men_computerglasses_display_order?: number;
  men_powered_sunglasses_display_order?: number;
  women_sunglasses_display_order?: number;
  women_eyeglasses_display_order?: number;
  women_computerglasses_display_order?: number;
  women_powered_sunglasses_display_order?: number;
  kids_sunglasses_display_order?: number;
  kids_eyeglasses_display_order?: number;
  kids_computerglasses_display_order?: number;
  kids_powered_sunglasses_display_order?: number;
  
  // Shape-specific display orders
  round_display_order?: number;
  cat_eye_display_order?: number;
  aviator_display_order?: number;
  wayfarer_display_order?: number;
  oval_display_order?: number;
  rectangle_display_order?: number;
  square_display_order?: number;
  latest_trend_display_order?: number;
  bestseller_display_order?: number;
}; 