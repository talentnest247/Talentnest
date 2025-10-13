-- =====================================================
-- MANAGE EXISTING USERS & FIX REGISTRATION ISSUES
-- =====================================================
-- This script helps you manage users who are stuck
-- Run this in your Supabase SQL Editor

-- ========================================
-- STEP 1: Check current user status
-- ========================================
SELECT 
    'auth.users' as source,
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'mediapowers13@gmail.com'
UNION ALL
SELECT 
    'public.users' as source,
    id,
    email,
    created_at::timestamp,
    NULL as email_confirmed_at,
    NULL as last_sign_in_at
FROM public.users
WHERE email = 'mediapowers13@gmail.com';

-- ========================================
-- STEP 2: Check if user has provider profile
-- ========================================
SELECT 
    p.*,
    u.email,
    u.full_name
FROM providers p
JOIN users u ON u.id = p.user_id
WHERE u.email = 'mediapowers13@gmail.com';

-- ========================================
-- OPTION A: Delete the user completely (if registration failed)
-- ========================================
-- Uncomment and run this ONLY if you want to delete the user and start fresh

/*
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'mediapowers13@gmail.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Delete from providers table first (if exists)
        DELETE FROM providers WHERE user_id = user_uuid;
        RAISE NOTICE '✅ Deleted provider profile';
        
        -- Delete from public.users
        DELETE FROM public.users WHERE id = user_uuid;
        RAISE NOTICE '✅ Deleted from public.users';
        
        -- Delete from auth.users (requires admin privileges)
        DELETE FROM auth.users WHERE id = user_uuid;
        RAISE NOTICE '✅ Deleted from auth.users';
        
        RAISE NOTICE '';
        RAISE NOTICE '==========================================';
        RAISE NOTICE '✅ USER DELETED SUCCESSFULLY!';
        RAISE NOTICE '==========================================';
        RAISE NOTICE 'You can now register with: mediapowers13@gmail.com';
        RAISE NOTICE '==========================================';
    ELSE
        RAISE NOTICE '❌ User not found';
    END IF;
END $$;
*/

-- ========================================
-- OPTION B: Complete the user registration (if user exists but incomplete)
-- ========================================
-- Run this if the user exists in auth.users but not in public.users or providers

DO $$
DECLARE
    user_uuid UUID;
    user_exists_in_public BOOLEAN;
    provider_exists BOOLEAN;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'mediapowers13@gmail.com';
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE '❌ User does not exist in auth.users';
        RAISE NOTICE 'User can register normally at /register';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Found user in auth.users: %', user_uuid;
    
    -- Check if user exists in public.users
    SELECT EXISTS(SELECT 1 FROM public.users WHERE id = user_uuid) INTO user_exists_in_public;
    
    IF NOT user_exists_in_public THEN
        RAISE NOTICE '⚠️  User not in public.users, creating entry...';
        
        INSERT INTO public.users (
            id, 
            email, 
            role, 
            full_name, 
            first_name, 
            last_name, 
            phone,
            created_at
        )
        VALUES (
            user_uuid,
            'mediapowers13@gmail.com',
            'artisan',
            'Mohammed Nest',
            'Mohammed',
            'Nest',
            '',  -- Add phone if known
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            role = 'artisan',
            updated_at = NOW();
        
        RAISE NOTICE '✅ User created in public.users';
    ELSE
        RAISE NOTICE '✅ User already exists in public.users';
    END IF;
    
    -- Check if provider profile exists
    SELECT EXISTS(SELECT 1 FROM providers WHERE user_id = user_uuid) INTO provider_exists;
    
    IF NOT provider_exists THEN
        RAISE NOTICE '⚠️  Provider profile does not exist, creating...';
        
        INSERT INTO providers (
            user_id,
            business_name,
            description,
            bio,
            specialization,
            experience,
            location,
            verification_status,
            verification_evidence,
            certificates,
            rating,
            total_reviews,
            verified,
            availability_is_available,
            availability_available_for_work,
            availability_available_for_learning,
            availability_response_time,
            pricing_currency,
            pricing_base_rate,
            pricing_learning_rate,
            whatsapp_number
        )
        VALUES (
            user_uuid,
            'Mohammed Nest Services',
            'Professional service provider',
            NULL,
            ARRAY['General Services'],
            0,
            '',
            'pending',
            ARRAY[]::text[],
            ARRAY[]::text[],
            0.0,
            0,
            false,
            true,
            true,
            false,
            'Usually responds within 24 hours',
            'NGN',
            NULL,
            NULL,
            NULL
        );
        
        RAISE NOTICE '✅ Provider profile created';
    ELSE
        RAISE NOTICE '✅ Provider profile already exists';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '✅ USER REGISTRATION COMPLETED!';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'User: mediapowers13@gmail.com';
    RAISE NOTICE 'Role: artisan (service provider)';
    RAISE NOTICE 'Status: Can now login at /login';
    RAISE NOTICE '==========================================';
END $$;

-- ========================================
-- STEP 3: Verify the fix
-- ========================================
SELECT 
    u.id,
    u.email,
    u.role,
    u.full_name,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Has Provider Profile'
        ELSE '❌ Missing Provider Profile'
    END as provider_status,
    p.verification_status
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
WHERE u.email = 'mediapowers13@gmail.com';

-- ========================================
-- BONUS: List all incomplete registrations
-- ========================================
SELECT 
    u.email,
    u.role,
    u.created_at,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Complete'
        WHEN u.role = 'artisan' THEN '❌ Missing Provider Profile'
        ELSE '✅ Complete (Student)'
    END as registration_status
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
WHERE u.role = 'artisan'
ORDER BY u.created_at DESC
LIMIT 20;
