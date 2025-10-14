-- =====================================================
-- SIMPLE FIX FOR PROVIDER APPROVAL SYSTEM
-- Run this ONE TIME in Supabase SQL Editor
-- =====================================================

-- First, let's check what we have
DO $$ 
DECLARE
    provider_count INT;
    pending_count INT;
BEGIN
    SELECT COUNT(*) INTO provider_count FROM providers;
    SELECT COUNT(*) INTO pending_count FROM providers WHERE verification_status = 'pending';
    
    RAISE NOTICE 'Total providers: %', provider_count;
    RAISE NOTICE 'Pending providers: %', pending_count;
END $$;

-- Show all providers with their user details
SELECT 
    p.id as provider_id,
    p.business_name,
    p.verification_status,
    p.verified,
    p.created_at as provider_created,
    u.email,
    u.full_name,
    u.role,
    u.created_at as user_created
FROM providers p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- If no providers exist, check if we have artisan users without provider profiles
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.role,
    u.created_at,
    CASE 
        WHEN p.id IS NULL THEN '❌ MISSING PROVIDER PROFILE'
        ELSE '✅ Has provider profile'
    END as status
FROM users u
LEFT JOIN providers p ON u.id = p.user_id
WHERE u.role = 'artisan'
ORDER BY u.created_at DESC;

-- Check RLS policies on providers table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'providers'
ORDER BY policyname;
