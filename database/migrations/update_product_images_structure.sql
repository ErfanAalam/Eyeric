-- Update products table to replace colors structure with simple images array
-- This migration removes the complex colors structure and replaces it with a simple images array

-- Step 1: Create a backup of the current colors data
CREATE TABLE IF NOT EXISTS products_colors_backup AS 
SELECT id, colors FROM products WHERE colors IS NOT NULL;

-- Step 2: Add the new images column as JSONB
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Step 3: Migrate existing colors data to new images format
-- This migration handles both old formats:
-- 1. { color: string; images: string[] }[]
-- 2. { colors: string[]; images: string[] }[]

-- Create a function to extract all images from colors structure
CREATE OR REPLACE FUNCTION extract_images_from_colors(colors_data jsonb)
RETURNS jsonb AS $$
DECLARE
    result jsonb := '[]'::jsonb;
    color_obj jsonb;
    images_array jsonb;
    img text;
    display_order int := 1;
BEGIN
    -- If colors is null or empty, return empty array
    IF colors_data IS NULL OR colors_data = '[]'::jsonb THEN
        RETURN result;
    END IF;
    
    -- Iterate through each color object
    FOR color_obj IN SELECT jsonb_array_elements(colors_data)
    LOOP
        -- Check if this color object has images
        IF color_obj ? 'images' AND jsonb_typeof(color_obj->'images') = 'array' THEN
            images_array := color_obj->'images';
            
            -- Extract each image URL
            FOR img IN SELECT jsonb_array_elements_text(images_array)
            LOOP
                -- Only add non-empty image URLs
                IF img IS NOT NULL AND img != '' THEN
                    result := result || jsonb_build_object('url', img, 'display_order', display_order);
                    display_order := display_order + 1;
                END IF;
            END LOOP;
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update products with migrated images
UPDATE products 
SET images = extract_images_from_colors(colors)
WHERE colors IS NOT NULL AND colors != '[]'::jsonb;

-- Drop the temporary function
DROP FUNCTION IF EXISTS extract_images_from_colors(jsonb);

-- Step 4: Create an index on the images column for better query performance
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);

-- Step 5: Add a comment to document the new structure
COMMENT ON COLUMN products.images IS 'Array of image objects with url and display_order: [{"url": "image_url", "display_order": 1}, ...]';

-- Step 6: Drop the old colors column (after confirming migration worked)
-- ALTER TABLE products DROP COLUMN IF EXISTS colors;

-- Step 7: Verify migration results
-- Check how many products were migrated
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN images != '[]'::jsonb THEN 1 END) as products_with_images,
  COUNT(CASE WHEN colors IS NOT NULL THEN 1 END) as products_with_old_colors
FROM products;

-- Show sample of migrated data
SELECT 
  id,
  title,
  jsonb_array_length(images) as image_count,
  images
FROM products 
WHERE images != '[]'::jsonb 
LIMIT 5;

-- Step 8: Optional - Clean up backup table after confirming migration
-- DROP TABLE IF EXISTS products_colors_backup; 