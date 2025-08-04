-- Add display_order column to lenses table
ALTER TABLE public.lenses 
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_lenses_display_order ON public.lenses(display_order);

-- Update existing lenses to have a default display order based on creation date
UPDATE public.lenses 
SET display_order = EXTRACT(EPOCH FROM created_at)::INTEGER 
WHERE display_order = 0;

-- Add comment to explain the display_order column
COMMENT ON COLUMN public.lenses.display_order IS 'Order in which lenses should be displayed (lower numbers appear first)'; 