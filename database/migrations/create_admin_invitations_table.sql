-- Create admin_invitations table for storing pending admin invitations
CREATE TABLE IF NOT EXISTS public.admin_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    invited_by UUID REFERENCES public.admin(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to insert invitations
CREATE POLICY "Admins can insert invitations" ON public.admin_invitations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow reading invitations (for token validation)
CREATE POLICY "Anyone can read invitations" ON public.admin_invitations
    FOR SELECT USING (true);

-- Create index on token for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON public.admin_invitations(token);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON public.admin_invitations(email); 