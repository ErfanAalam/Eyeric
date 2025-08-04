-- Add cart_items and powers columns to user table
-- These columns will store arrays of objects as JSONB

-- Add cart_items column
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS cart_items JSONB DEFAULT '[]'::jsonb;

-- Add powers column
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS powers JSONB DEFAULT '[]'::jsonb;

-- Add comments to document the columns
COMMENT ON COLUMN "user".cart_items IS 'Array of cart item objects stored as JSONB';
COMMENT ON COLUMN "user".powers IS 'Array of power entry objects stored as JSONB';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_cart_items 
ON "user" USING GIN (cart_items);

CREATE INDEX IF NOT EXISTS idx_user_powers 
ON "user" USING GIN (powers);

-- Example of how cart_items data will be stored:
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

-- Example of how powers data will be stored:
-- powers = [
--   {
--     "id": "power-uuid-1",
--     "name": "John Doe",
--     "phone": "1234567890",
--     "method": "manual",
--     "power_details": {
--       "samePower": true,
--       "cylindrical": false,
--       "leftSPH": "-2.5",
--       "rightSPH": "-2.5",
--       "leftCYL": "",
--       "rightCYL": "",
--       "leftAxis": "",
--       "rightAxis": "",
--       "leftAddlPower": "",
--       "rightAddlPower": ""
--     },
--     "prescription_image_url": null,
--     "created_at": "2024-01-01T00:00:00Z"
--   }
-- ] 