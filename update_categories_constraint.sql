-- Update the categories table constraint to allow 'frame_material' as a category type
-- First, drop the existing constraint
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_category_type_check;

-- Add the new constraint that includes 'frame_material'
ALTER TABLE public.categories ADD CONSTRAINT categories_category_type_check 
CHECK (
  category_type = ANY (
    ARRAY[
      'gender'::text,
      'type'::text,
      'style'::text,
      'shape'::text,
      'frame_material'::text
    ]
  )
);

-- Insert some default frame materials (without ON CONFLICT since there's no unique constraint)
INSERT INTO public.categories (name, category_type) VALUES
  ('Metal', 'frame_material'),
  ('Plastic', 'frame_material'),
  ('Acetate', 'frame_material'),
  ('Titanium', 'frame_material'),
  ('Stainless Steel', 'frame_material'); 