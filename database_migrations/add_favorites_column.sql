-- Add favorite_products column to user table
-- This column will store an array of product objects as JSONB

ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS favorite_products JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN "user".favorite_products IS 'Array of favorite product objects stored as JSONB';

-- Create an index for better query performance when searching favorites
CREATE INDEX IF NOT EXISTS idx_user_favorite_products 
ON "user" USING GIN (favorite_products);

-- Example of how the data will be stored:
-- favorite_products = [
--   {
--     "id": "product-uuid-1",
--     "title": "Product Name",
--     "description": "Product description",
--     "original_price": 1000,
--     "discounted_price": 800,
--     "banner_image_1": "image-url-1",
--     "banner_image_2": "image-url-2",
--     "shape_category": "Round",
--     "gender_category": ["men", "women"],
--     "type_category": ["eyeglasses"],
--     "created_at": "2024-01-01T00:00:00Z"
--   }
-- ] 