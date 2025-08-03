-- Add active status and display order columns to slide table
-- This migration adds functionality to control which slides are active and their display order

-- Add is_active column (default to true for existing slides)
ALTER TABLE slide ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add display_order column (default to 0 for existing slides)
ALTER TABLE slide ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for better query performance when filtering by active status
CREATE INDEX IF NOT EXISTS idx_slide_is_active ON slide(is_active);

-- Create index for better query performance when ordering by display order
CREATE INDEX IF NOT EXISTS idx_slide_display_order ON slide(display_order);

-- Update existing slides to have a display order based on creation date
-- This ensures existing slides have a proper order
UPDATE slide 
SET display_order = (
  SELECT row_number() OVER (ORDER BY created_at ASC) - 1
  FROM slide s2 
  WHERE s2.id = slide.id
)
WHERE display_order = 0;

-- Add comment to document the new columns
COMMENT ON COLUMN slide.is_active IS 'Controls whether the slide is active and visible on the frontend';
COMMENT ON COLUMN slide.display_order IS 'Determines the order in which slides are displayed (lower numbers appear first)'; 