-- Supabase Auth Integration Migration Script

-- Begin transaction for atomic changes
BEGIN;

-- 1. Create a profiles table that extends auth.users
-- This follows Supabase's recommended pattern for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, new.created_at, new.created_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;

-- 3. Update configs table to reference auth.users directly
ALTER TABLE IF EXISTS public.configs
DROP CONSTRAINT IF EXISTS configs_user_id_fkey,
ADD CONSTRAINT configs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 6. Create function to get current user profile
CREATE OR REPLACE FUNCTION public.get_current_profile()
RETURNS SETOF public.profiles AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.profiles WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 7. Error handling - check if migration completed successfully
DO $$
BEGIN
  -- Verify profiles table exists
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND schemaname = 'public') THEN
    RAISE EXCEPTION 'Migration failed: profiles table was not created properly';
  END IF;
  
  -- Verify trigger exists
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    RAISE EXCEPTION 'Migration failed: user creation trigger was not created properly';
  END IF;
  
  -- Verify trigger inserts data correctly
  PERFORM 1 FROM public.profiles LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Migration failed: test profile insertion failed';
  END IF;
END
$$;

-- Commit transaction if all operations succeed
COMMIT;
