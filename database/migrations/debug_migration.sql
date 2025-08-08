-- Debug script to check the current state of the products table
-- Run this to understand why the migration might not be working

-- 1. Check if the products table exists and has the colors column
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('colors', 'images')
ORDER BY column_name;

-- 2. Check the current structure of the colors column (sample data)
SELECT 
    id,
    title,
    jsonb_typeof(colors) as colors_type,
    jsonb_array_length(colors) as colors_array_length,
    colors
FROM products 
WHERE colors IS NOT NULL 
LIMIT 5;

-- 3. Check if there are any products with colors data
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN colors IS NOT NULL THEN 1 END) as products_with_colors,
    COUNT(CASE WHEN colors != '[]'::jsonb THEN 1 END) as products_with_non_empty_colors,
    COUNT(CASE WHEN images IS NOT NULL THEN 1 END) as products_with_images
FROM products;

-- 4. Check the structure of a specific product's colors
SELECT 
    id,
    title,
    colors,
    CASE 
        WHEN jsonb_typeof(colors) = 'array' THEN 'array'
        WHEN jsonb_typeof(colors) = 'object' THEN 'object'
        WHEN jsonb_typeof(colors) = 'string' THEN 'string'
        ELSE 'other'
    END as colors_structure,
    CASE 
        WHEN jsonb_typeof(colors) = 'array' AND jsonb_array_length(colors) > 0 THEN
            CASE 
                WHEN colors->0 ? 'images' THEN 'has_images'
                WHEN colors->0 ? 'color' THEN 'has_color'
                ELSE 'unknown_structure'
            END
        ELSE 'no_array_or_empty'
    END as colors_content_type
FROM products 
WHERE colors IS NOT NULL 
LIMIT 3;

-- 5. Test the extraction function on a sample product
-- First, let's create the function to test it
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

-- 6. Test the function on a sample product
SELECT 
    id,
    title,
    colors,
    extract_images_from_colors(colors) as extracted_images
FROM products 
WHERE colors IS NOT NULL 
LIMIT 3;

-- 7. Check if the images column exists
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'images'; 