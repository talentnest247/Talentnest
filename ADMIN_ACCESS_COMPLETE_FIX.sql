-- =====================================================
-- COMPLETE ADMIN ACCESS FIX
-- Run this ONCE to fix everything and get admin access
-- =====================================================

-- Step 1: Add missing columns (if they don't exist)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER;

-- Step 2: Update the trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, first_name, last_name, phone, student_id, department, level, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'department',
    CASE WHEN NEW.raw_user_meta_data->>'level' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'level')::INTEGER 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    student_id = COALESCE(EXCLUDED.student_id, public.users.student_id),
    department = COALESCE(EXCLUDED.department, public.users.department),
    level = COALESCE(EXCLUDED.level, public.users.level),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Make talentnest247@gmail.com an admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'talentnest247@gmail.com';

-- Step 4: Verify and show results
DO $$
DECLARE
  user_exists BOOLEAN;
  user_role TEXT;
  user_id UUID;
BEGIN
  -- Check if user exists
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'talentnest247@gmail.com'
  ) INTO user_exists;
  
  IF user_exists THEN
    -- Get user details
    SELECT id, role INTO user_id, user_role 
    FROM public.users 
    WHERE email = 'talentnest247@gmail.com';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ ADMIN ACCESS RESTORED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Email: talentnest247@gmail.com';
    RAISE NOTICE 'User ID: %', user_id;
    RAISE NOTICE 'Role: %', user_role;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Login Credentials:';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE 'URL: http://localhost:3000/admin/login';
    RAISE NOTICE 'Email: talentnest247@gmail.com';
    RAISE NOTICE 'Password: talentnest247';
    RAISE NOTICE 'Access Code: UNILORIN-ADMIN-2025';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '';
    RAISE NOTICE '✅ You can now access the admin dashboard!';
    RAISE NOTICE '========================================';
  ELSE
    RAISE NOTICE '========================================';
    RAISE NOTICE '❌ USER NOT FOUND!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Email talentnest247@gmail.com is not registered.';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Register First:';
    RAISE NOTICE '1. Visit: http://localhost:3000/signup';
    RAISE NOTICE '2. Email: talentnest247@gmail.com';
    RAISE NOTICE '3. Password: talentnest247';
    RAISE NOTICE '4. Complete registration';
    RAISE NOTICE '5. Then run this SQL again';
    RAISE NOTICE '========================================';
  END IF;
END $$;
