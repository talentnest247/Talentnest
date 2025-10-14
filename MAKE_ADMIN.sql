-- =====================================================
-- MAKE ADMIN ACCOUNT
-- Run this to give admin privileges to talentnest247@gmail.com
-- =====================================================

-- First, check if the user exists
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'talentnest247@gmail.com'
  ) INTO user_exists;
  
  IF user_exists THEN
    RAISE NOTICE '✅ User found: talentnest247@gmail.com';
  ELSE
    RAISE NOTICE '❌ User NOT found: talentnest247@gmail.com';
    RAISE NOTICE '';
    RAISE NOTICE 'YOU NEED TO REGISTER FIRST!';
    RAISE NOTICE 'Visit: http://localhost:3000/signup';
    RAISE NOTICE 'Register with: talentnest247@gmail.com';
    RAISE NOTICE 'Then run this SQL again.';
  END IF;
END $$;

-- Update user to admin role
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'talentnest247@gmail.com';

-- Verify it worked
DO $$
DECLARE
  user_role TEXT;
  rows_updated INTEGER;
BEGIN
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  IF rows_updated > 0 THEN
    SELECT role INTO user_role FROM public.users WHERE email = 'talentnest247@gmail.com';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ ADMIN PRIVILEGES GRANTED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Email: talentnest247@gmail.com';
    RAISE NOTICE 'Role: %', user_role;
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Steps:';
    RAISE NOTICE '1. Go to: http://localhost:3000/admin/login';
    RAISE NOTICE '2. Enter email: talentnest247@gmail.com';
    RAISE NOTICE '3. Enter password: (your password)';
    RAISE NOTICE '4. Enter access code: UNILORIN-ADMIN-2025';
    RAISE NOTICE '5. Click "Access Admin Portal"';
    RAISE NOTICE '';
    RAISE NOTICE '✅ You can now access the admin dashboard!';
    RAISE NOTICE '========================================';
  ELSE
    RAISE NOTICE '========================================';
    RAISE NOTICE '❌ NO USER FOUND TO UPDATE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'The email talentnest247@gmail.com is not registered.';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 What to do:';
    RAISE NOTICE '1. Visit: http://localhost:3000/signup';
    RAISE NOTICE '2. Register with email: talentnest247@gmail.com';
    RAISE NOTICE '3. Use password: talentnest247 (or your own)';
    RAISE NOTICE '4. Complete registration';
    RAISE NOTICE '5. Then run this SQL again';
    RAISE NOTICE '========================================';
  END IF;
END $$;
