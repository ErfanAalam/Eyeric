-- Create admin table for storing admin credentials
CREATE TABLE IF NOT EXISTS public.admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only admins to read/insert/update their own row (for now, open for development)
CREATE POLICY "Admins can view own row" ON public.admin
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert" ON public.admin
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update own row" ON public.admin
    FOR UPDATE USING (auth.role() = 'authenticated'); 