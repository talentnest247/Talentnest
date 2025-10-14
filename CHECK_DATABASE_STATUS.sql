-- =====================================================
-- SAFE DIAGNOSTIC SCRIPT - NO MODIFICATIONS
-- Just checks database state without changing anything
-- =====================================================

-- 1. Count all providers by status
SELECT 
    '========================================' as divider,
    'PROVIDER COUNTS BY STATUS' as section;

SELECT 
    COALESCE(verification_status, 'NULL') as status,
    COUNT(*) as count
FROM providers
GROUP BY verification_status
UNION ALL
SELECT 'TOTAL', COUNT(*) FROM providers
ORDER BY status;

-- 2. List ALL providers with details
SELECT 
    '========================================' as divider,
    'ALL PROVIDERS (RECENT FIRST)' as section;

SELECT 
    p.id,
    p.business_name,
    p.verification_status,
    p.verified,
    TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
    u.email,
    u.full_name,
    u.role
FROM providers p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- 3. Find artisan users WITHOUT provider profiles
SELECT 
    '========================================' as divider,
    'ARTISANS WITHOUT PROVIDER PROFILES' as section;

SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    TO_CHAR(u.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
    CASE 
        WHEN p.id IS NULL THEN '❌ MISSING PROVIDER PROFILE'
        ELSE '✅ Has provider profile'
    END as status
FROM users u
LEFT JOIN providers p ON u.id = p.user_id
WHERE u.role = 'artisan'
ORDER BY u.created_at DESC;

-- 4. Count users by role
SELECT 
    '========================================' as divider,
    'USER COUNTS BY ROLE' as section;

SELECT 
    COALESCE(role, 'NULL') as role,
    COUNT(*) as count
FROM users
GROUP BY role
ORDER BY role;

-- 5. Check RLS policies on providers table
SELECT 
    '========================================' as divider,
    'RLS POLICIES ON PROVIDERS TABLE' as section;

SELECT 
    policyname,
    roles,
    cmd as command,
    CASE 
        WHEN policyname LIKE '%service_role%' THEN '✅ Service role access enabled'
        ELSE 'ℹ️  Regular policy'
    END as notes
FROM pg_policies 
WHERE tablename = 'providers'
ORDER BY policyname;

-- 6. Check if test user exists
SELECT 
    '========================================' as divider,
    'TEST USER STATUS' as section;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE email = 'test.artisan@talentnest.com') 
        THEN '✅ Test user exists in public.users'
        ELSE '❌ Test user does NOT exist in public.users'
    END as public_users_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM auth.users WHERE email = 'test.artisan@talentnest.com') 
        THEN '✅ Test user exists in auth.users'
        ELSE '❌ Test user does NOT exist in auth.users'
    END as auth_users_status;

-- 7. Summary
SELECT 
    '========================================' as divider,
    'SUMMARY' as section;

SELECT 
    (SELECT COUNT(*) FROM providers) as total_providers,
    (SELECT COUNT(*) FROM providers WHERE verification_status = 'pending') as pending_providers,
    (SELECT COUNT(*) FROM providers WHERE verification_status = 'approved') as approved_providers,
    (SELECT COUNT(*) FROM providers WHERE verification_status = 'rejected') as rejected_providers,
    (SELECT COUNT(*) FROM users WHERE role = 'artisan') as total_artisans,
    (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
    (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins;
