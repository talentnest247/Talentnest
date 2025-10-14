-- =====================================================
-- QUICK DATABASE CHECK + FIX
-- Run this to check providers and fix issues
-- =====================================================

-- Step 1: Check if providers table exists and what's in it
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 DATABASE STATUS CHECK';
  RAISE NOTICE '========================================';
END $$;

-- Show all providers (if any)
SELECT 
  id,
  business_name,
  verification_status,
  created_at,
  user_id
FROM public.providers
ORDER BY created_at DESC;

-- Step 2: Add missing columns to users table (if needed)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Step 3: Update trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    first_name, 
    last_name, 
    phone, 
    student_id, 
    department, 
    level, 
    bio,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'department',
    CASE 
      WHEN NEW.raw_user_meta_data->>'level' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'level')::INTEGER 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'bio',
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
    bio = COALESCE(EXCLUDED.bio, public.users.bio),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Make admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'talentnest247@gmail.com';

-- Step 5: Show results
DO $$
DECLARE
  provider_count INTEGER;
  pending_count INTEGER;
  approved_count INTEGER;
  user_exists BOOLEAN;
  user_role TEXT;
BEGIN
  -- Count providers
  SELECT COUNT(*) INTO provider_count FROM public.providers;
  SELECT COUNT(*) INTO pending_count FROM public.providers WHERE verification_status = 'pending';
  SELECT COUNT(*) INTO approved_count FROM public.providers WHERE verification_status = 'approved';
  
  -- Check admin
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'talentnest247@gmail.com'
  ) INTO user_exists;
  
  IF user_exists THEN
    SELECT role INTO user_role FROM public.users WHERE email = 'talentnest247@gmail.com';
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ DATABASE FIX COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Provider Statistics:';
  RAISE NOTICE '  Total Providers: %', provider_count;
  RAISE NOTICE '  Pending: %', pending_count;
  RAISE NOTICE '  Approved: %', approved_count;
  RAISE NOTICE '';
  
  IF provider_count = 0 THEN
    RAISE NOTICE '⚠️  NO PROVIDERS FOUND!';
    RAISE NOTICE '';
    RAISE NOTICE 'This means:';
    RAISE NOTICE '1. Provider registration failed';
    RAISE NOTICE '2. Or provider table is empty';
    RAISE NOTICE '3. You need to register a provider again';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Steps:';
    RAISE NOTICE '1. Visit: http://localhost:3000/register';
    RAISE NOTICE '2. Select "Artisan" role';
    RAISE NOTICE '3. Fill registration form';
    RAISE NOTICE '4. Check terminal for "Provider profile created successfully"';
  ELSE
    RAISE NOTICE '✅ Found % provider(s)!', provider_count;
    
    IF pending_count > 0 THEN
      RAISE NOTICE '';
      RAISE NOTICE '🎯 Action Required:';
      RAISE NOTICE '% provider(s) waiting for approval!', pending_count;
      RAISE NOTICE '';
      RAISE NOTICE 'Login to admin dashboard:';
      RAISE NOTICE 'URL: http://localhost:3000/admin/login';
      RAISE NOTICE 'Email: talentnest247@gmail.com';
      RAISE NOTICE 'Password: talentnest247';
      RAISE NOTICE 'Access Code: UNILORIN-ADMIN-2025';
    END IF;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '👤 Admin Status:';
  IF user_exists THEN
    RAISE NOTICE '  Email: talentnest247@gmail.com';
    RAISE NOTICE '  Role: %', user_role;
    RAISE NOTICE '  Status: ✅ Ready';
  ELSE
    RAISE NOTICE '  Status: ❌ Not found';
    RAISE NOTICE '  Action: Register admin account first';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
