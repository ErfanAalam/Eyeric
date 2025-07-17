-- Create lenses table for storing lens products
CREATE TABLE IF NOT EXISTS public.lenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL,
    original_price NUMERIC(10,2) NOT NULL,
    discounted_price NUMERIC(10,2),
    category TEXT NOT NULL CHECK (category IN ('single vision', 'progressive', 'zero power', 'frame only')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.lenses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to manage lenses (open for now)
CREATE POLICY "Admins can manage lenses" ON public.lenses
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lenses_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_lenses_updated_at 
    BEFORE UPDATE ON public.lenses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_lenses_updated_at_column();

-- Create index on title for faster lookups
CREATE INDEX IF NOT EXISTS idx_lenses_title ON public.lenses(title); 