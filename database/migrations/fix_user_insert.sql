-- Function to handle user profile creation during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user (id, first_name, last_name, email, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when auth.users record is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the RLS policy to be more permissive for the function
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user;
CREATE POLICY "Users can insert own profile" ON public.user
    FOR INSERT WITH CHECK (true);

-- Also allow the function to insert
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user TO anon, authenticated; 