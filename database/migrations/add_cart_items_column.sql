-- Add cart_items column to user table
-- This column will store an array of cart item objects as JSONB

ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS cart_items JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN "user".cart_items IS 'Array of cart item objects stored as JSONB';

-- Create an index for better query performance when searching cart items
CREATE INDEX IF NOT EXISTS idx_user_cart_items 
ON "user" USING GIN (cart_items);

-- Example of how the data will be stored:
-- cart_items = [
--   {
--     "product": {
--       "id": "product-uuid-1",
--       "title": "Product Name",
--       "description": "Product description",
--       "original_price": 1000,
--       "discounted_price": 800,
--       "banner_image_1": "image-url-1",
--       "banner_image_2": "image-url-2",
--       "shape_category": "Round",
--       "gender_category": ["men", "women"],
--       "type_category": ["eyeglasses"],
--       "created_at": "2024-01-01T00:00:00Z"
--     },
--     "lens": {
--       "id": "lens-uuid-1",
--       "title": "Lens Name",
--       "original_price": 500,
--       "category": "single vision"
--     },
--     "powerCategory": "manual",
--     "quantity": 1
--   }
-- ] 