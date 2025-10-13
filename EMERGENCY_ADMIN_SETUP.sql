-- =====================================================
-- EMERGENCY ADMIN ACCOUNT SETUP
-- =====================================================
-- Run this if you're getting "admin login failed"
-- This creates/updates the admin account directly

-- First, let's check if the user exists in auth.users
DO $$
DECLARE
  auth_user_exists BOOLEAN;
  public_user_exists BOOLEAN;
  admin_user_id UUID;
BEGIN
  -- Check auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'talentnest247@gmail.com') INTO auth_user_exists;
  
  IF NOT auth_user_exists THEN
    RAISE NOTICE '❌ User does not exist in auth.users';
    RAISE NOTICE '➡️  ACTION REQUIRED:';
    RAISE NOTICE '   1. Go to /signup';
    RAISE NOTICE '   2. Sign up with email: talentnest247@gmail.com';
    RAISE NOTICE '   3. Password: talentnest247';
    RAISE NOTICE '   4. Then run this script again';
    RAISE EXCEPTION 'User must sign up first';
  ELSE
    RAISE NOTICE '✅ User exists in auth.users';
    
    -- Get the user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'talentnest247@gmail.com';
    
    -- Check if user exists in public.users
    SELECT EXISTS(SELECT 1 FROM public.users WHERE email = 'talentnest247@gmail.com') INTO public_user_exists;
    
    IF NOT public_user_exists THEN
      RAISE NOTICE '⚠️  User not in public.users, creating entry...';
      
      -- Insert into public.users
      INSERT INTO public.users (id, email, role, full_name, first_name, last_name, created_at)
      VALUES (
        admin_user_id,
        'talentnest247@gmail.com',
        'admin',
        'TalentNest Admin',
        'Admin',
        'TalentNest',
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        updated_at = NOW();
      
      RAISE NOTICE '✅ Admin user created in public.users';
    ELSE
      RAISE NOTICE '✅ User exists in public.users';
      
      -- Update to admin role
      UPDATE public.users 
      SET role = 'admin', updated_at = NOW()
      WHERE email = 'talentnest247@gmail.com';
      
      RAISE NOTICE '✅ Role updated to admin';
    END IF;
    
    -- Show final status
    RAISE NOTICE '';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '✅ ADMIN ACCOUNT READY!';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Email: talentnest247@gmail.com';
    RAISE NOTICE 'Password: talentnest247';
    RAISE NOTICE 'Access Code: UNILORIN-ADMIN-2025';
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 Login at: /admin/login';
    RAISE NOTICE '==========================================';
  END IF;
END $$;

-- Verify the setup
SELECT 
  u.id,
  u.email,
  u.role,
  u.full_name,
  u.created_at,
  u.updated_at
FROM public.users u
WHERE u.email = 'talentnest247@gmail.com';
