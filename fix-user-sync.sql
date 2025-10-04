-- =====================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- =====================================================
-- This trigger automatically creates a row in public.users 
-- when a new user signs up via Supabase Auth

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- MANUALLY ADD EXISTING AUTH USERS TO USERS TABLE
-- =====================================================
-- This will add any existing auth users who don't have a users row yet

INSERT INTO public.users (id, email, first_name, last_name, role, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  COALESCE(au.raw_user_meta_data->>'role', 'student'),
  au.created_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Show how many users were added
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  RAISE NOTICE '✅ Sync complete! Total users in public.users: %', user_count;
END $$;

-- =====================================================
-- MAKE YOURSELF ADMIN
-- =====================================================
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'talentnest247@gmail.com';

-- Confirm admin setup
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE email = 'talentnest247@gmail.com' AND role = 'admin') THEN
    RAISE NOTICE '✅ Admin user created successfully!';
  ELSE
    RAISE NOTICE '⚠️  User talentnest247@gmail.com not found. Make sure you sign up first!';
  END IF;
END $$;
