-- =====================================================
-- FORCE USER SYNC - RUN THIS NOW
-- =====================================================
-- This will definitely sync your users

-- Step 1: Check what's in auth.users
DO $$
DECLARE
  auth_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  RAISE NOTICE '📊 Users in auth.users: %', auth_count;
END $$;

-- Step 2: Check what's in public.users
DO $$
DECLARE
  public_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO public_count FROM public.users;
  RAISE NOTICE '📊 Users in public.users: %', public_count;
END $$;

-- Step 3: Show auth users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  RAISE NOTICE '--- AUTH USERS ---';
  FOR user_record IN 
    SELECT id, email, created_at 
    FROM auth.users 
    ORDER BY created_at DESC
  LOOP
    RAISE NOTICE 'Auth User: % | %', user_record.email, user_record.id;
  END LOOP;
END $$;

-- Step 4: Show public users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  RAISE NOTICE '--- PUBLIC USERS ---';
  FOR user_record IN 
    SELECT id, email, role, created_at 
    FROM public.users 
    ORDER BY created_at DESC
  LOOP
    RAISE NOTICE 'Public User: % | % | %', user_record.email, user_record.role, user_record.id;
  END LOOP;
END $$;

-- Step 5: Force sync ALL auth users to public.users
INSERT INTO public.users (
  id, 
  email, 
  first_name, 
  last_name, 
  role, 
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'firstName', au.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'lastName', au.raw_user_meta_data->>'last_name', ''),
  COALESCE(au.raw_user_meta_data->>'role', 'student'),
  au.created_at,
  NOW()
FROM auth.users au
ON CONFLICT (id) DO UPDATE 
SET 
  email = EXCLUDED.email,
  first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
  last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
  updated_at = NOW();

-- Step 6: Force set admin role for your email
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'talentnest247@gmail.com';

-- Step 7: Verify the sync
DO $$
DECLARE
  admin_user RECORD;
BEGIN
  SELECT * INTO admin_user 
  FROM public.users 
  WHERE email = 'talentnest247@gmail.com';
  
  IF FOUND THEN
    RAISE NOTICE '✅ SUCCESS! Admin user found:';
    RAISE NOTICE '   Email: %', admin_user.email;
    RAISE NOTICE '   Role: %', admin_user.role;
    RAISE NOTICE '   ID: %', admin_user.id;
    RAISE NOTICE '   Name: % %', admin_user.first_name, admin_user.last_name;
  ELSE
    RAISE NOTICE '❌ FAILED! User talentnest247@gmail.com not found in public.users';
    RAISE NOTICE '⚠️  Make sure you have signed up with this email first!';
  END IF;
END $$;

-- Step 8: Show final counts
DO $$
DECLARE
  auth_count INTEGER;
  public_count INTEGER;
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO public_count FROM public.users;
  SELECT COUNT(*) INTO admin_count FROM public.users WHERE role = 'admin';
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ SYNC COMPLETE!';
  RAISE NOTICE '📊 Auth users: %', auth_count;
  RAISE NOTICE '📊 Public users: %', public_count;
  RAISE NOTICE '👑 Admin users: %', admin_count;
  RAISE NOTICE '==========================================';
END $$;
