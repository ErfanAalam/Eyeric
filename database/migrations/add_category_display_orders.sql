-- Add category-specific display order columns to products table
-- These columns will store display order for each category combination

-- Gender-specific display orders
ALTER TABLE products ADD COLUMN IF NOT EXISTS mens_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS womens_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS kids_display_order INTEGER;

-- Type-specific display orders
ALTER TABLE products ADD COLUMN IF NOT EXISTS sunglasses_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS eyeglasses_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS computerglasses_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS powered_sunglasses_display_order INTEGER;

-- Shape-specific display orders
ALTER TABLE products ADD COLUMN IF NOT EXISTS round_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cat_eye_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS aviator_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS wayfarer_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS oval_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rectangle_display_order INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS square_display_order INTEGER;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_mens_display_order ON products(mens_display_order);
CREATE INDEX IF NOT EXISTS idx_products_womens_display_order ON products(womens_display_order);
CREATE INDEX IF NOT EXISTS idx_products_kids_display_order ON products(kids_display_order);

CREATE INDEX IF NOT EXISTS idx_products_sunglasses_display_order ON products(sunglasses_display_order);
CREATE INDEX IF NOT EXISTS idx_products_eyeglasses_display_order ON products(eyeglasses_display_order);
CREATE INDEX IF NOT EXISTS idx_products_computerglasses_display_order ON products(computerglasses_display_order);
CREATE INDEX IF NOT EXISTS idx_products_powered_sunglasses_display_order ON products(powered_sunglasses_display_order);

CREATE INDEX IF NOT EXISTS idx_products_round_display_order ON products(round_display_order);
CREATE INDEX IF NOT EXISTS idx_products_cat_eye_display_order ON products(cat_eye_display_order);
CREATE INDEX IF NOT EXISTS idx_products_aviator_display_order ON products(aviator_display_order);
CREATE INDEX IF NOT EXISTS idx_products_wayfarer_display_order ON products(wayfarer_display_order);
CREATE INDEX IF NOT EXISTS idx_products_oval_display_order ON products(oval_display_order);
CREATE INDEX IF NOT EXISTS idx_products_rectangle_display_order ON products(rectangle_display_order);
CREATE INDEX IF NOT EXISTS idx_products_square_display_order ON products(square_display_order); 