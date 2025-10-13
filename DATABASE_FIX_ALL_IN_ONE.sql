-- =====================================================
-- COMPLETE DATABASE FIX - ALL IN ONE FILE
-- =====================================================
-- This file contains ALL SQL commands to fix your database
-- Run commands in order, ONE AT A TIME in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- SECTION 1: FIX DATABASE SCHEMA
-- =====================================================
-- Add missing columns to users table
-- Run each command one by one

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department VARCHAR(100);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('student_id', 'department', 'level', 'avatar_url', 'bio');

-- =====================================================
-- SECTION 2: FIX ADMIN USER (talentnest247@gmail.com)
-- =====================================================

-- Check if admin exists in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'talentnest247@gmail.com';

-- If admin doesn't exist in public.users, get the ID from above query and run this:
-- Replace 'PASTE_ADMIN_ID_HERE' with the actual UUID from the query above

INSERT INTO public.users (id, email, role, full_name, first_name, last_name, created_at)
VALUES (
    'PASTE_ADMIN_ID_HERE'::uuid,
    'talentnest247@gmail.com',
    'admin',
    'TalentNest Admin',
    'Admin',
    'TalentNest',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = NOW();

-- Verify admin user
SELECT id, email, role, full_name FROM public.users WHERE email = 'talentnest247@gmail.com';

-- =====================================================
-- SECTION 3: FIX SERVICE PROVIDER (mediapowers13@gmail.com)
-- =====================================================

-- Step 1: Check if user exists in auth.users
SELECT id, email, created_at FROM auth.users WHERE email = 'mediapowers13@gmail.com';

-- Step 2: Check if user exists in public.users
SELECT id, email, role, full_name FROM public.users WHERE email = 'mediapowers13@gmail.com';

-- Step 3: If user doesn't exist in public.users, add them
-- Replace 'PASTE_USER_ID_HERE' with the UUID from Step 1

INSERT INTO public.users (id, email, role, full_name, first_name, last_name, phone, created_at)
VALUES (
    'PASTE_USER_ID_HERE'::uuid,
    'mediapowers13@gmail.com',
    'artisan',
    'Mohammed Nest',
    'Mohammed',
    'Nest',
    '',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET role = 'artisan', updated_at = NOW();

-- Step 4: Check if provider profile exists
SELECT p.id, p.user_id, p.business_name, p.verification_status, u.email
FROM providers p
JOIN users u ON u.id = p.user_id
WHERE u.email = 'mediapowers13@gmail.com';

-- Step 5: If provider profile doesn't exist, create it
-- Replace 'PASTE_USER_ID_HERE' with the UUID from Step 1

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
    whatsapp_number,
    created_at,
    updated_at
)
VALUES (
    'PASTE_USER_ID_HERE'::uuid,
    'Mohammed Nest Services',
    'Professional service provider',
    NULL,
    ARRAY['General Services']::text[],
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
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- Verify provider registration is complete
SELECT 
    u.email,
    u.role,
    u.full_name,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ Registration Complete'
        ELSE '❌ Missing Provider Profile'
    END as status,
    p.business_name,
    p.verification_status
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
WHERE u.email = 'mediapowers13@gmail.com';

-- =====================================================
-- SECTION 4: VERIFICATION QUERIES
-- =====================================================

-- Check all users and their provider status
SELECT 
    u.email,
    u.role,
    u.full_name,
    CASE 
        WHEN u.role = 'admin' THEN 'N/A (Admin)'
        WHEN u.role = 'student' THEN 'N/A (Student)'
        WHEN p.id IS NOT NULL THEN '✅ Has Provider Profile'
        ELSE '❌ Missing Provider Profile'
    END as provider_status,
    p.verification_status
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 20;

-- Check all pending providers (for admin dashboard)
SELECT 
    p.id,
    u.email,
    u.full_name,
    p.business_name,
    p.specialization,
    p.experience,
    p.location,
    p.verification_status,
    p.created_at
FROM providers p
JOIN users u ON u.id = p.user_id
WHERE p.verification_status = 'pending'
ORDER BY p.created_at DESC;

-- Count providers by status
SELECT 
    verification_status,
    COUNT(*) as count
FROM providers
GROUP BY verification_status;

-- =====================================================
-- SECTION 5: DELETE USER (OPTIONAL - USE WITH CAUTION!)
-- =====================================================
-- Run this ONLY if you want to completely delete a user and start fresh
-- WARNING: This permanently deletes ALL user data!

-- Step 1: Find the user you want to delete
SELECT id, email, role FROM public.users WHERE email = 'mediapowers13@gmail.com';

-- Step 2: Get the user ID and replace 'PASTE_USER_ID_HERE' below
-- Then run these commands to delete the user completely:

DELETE FROM providers WHERE user_id = 'PASTE_USER_ID_HERE'::uuid;
DELETE FROM public.users WHERE id = 'PASTE_USER_ID_HERE'::uuid;
DELETE FROM auth.users WHERE id = 'PASTE_USER_ID_HERE'::uuid;

-- Verify deletion
SELECT * FROM public.users WHERE email = 'mediapowers13@gmail.com';
-- Should return 0 rows if deletion was successful

-- =====================================================
-- SECTION 6: FIND ALL INCOMPLETE REGISTRATIONS
-- =====================================================
-- This helps identify users who registered but don't have complete profiles

-- Find auth users without public.users entry
SELECT 
    au.id,
    au.email,
    au.created_at,
    '❌ Not in public.users' as issue
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- Find artisans without provider profiles
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    '❌ Missing provider profile' as issue
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
WHERE u.role = 'artisan' AND p.id IS NULL
ORDER BY u.created_at DESC;

-- =====================================================
-- SECTION 7: BULK FIX ALL INCOMPLETE REGISTRATIONS
-- =====================================================
-- This automatically fixes all incomplete registrations
-- RUN WITH CAUTION - Review the results from Section 6 first!

-- Create provider profiles for all artisans without one
INSERT INTO providers (
    user_id,
    business_name,
    description,
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
    created_at,
    updated_at
)
SELECT 
    u.id,
    CONCAT(u.full_name, ' Services'),
    'Professional service provider',
    ARRAY['General Services']::text[],
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
    NOW(),
    NOW()
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
WHERE u.role = 'artisan' AND p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify all artisans now have provider profiles
SELECT 
    COUNT(*) as total_artisans,
    COUNT(p.id) as with_provider_profile,
    COUNT(*) - COUNT(p.id) as missing_provider_profile
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
WHERE u.role = 'artisan';

-- =====================================================
-- SECTION 8: DATABASE HEALTH CHECK
-- =====================================================
-- Run this to get a complete overview of your database

-- User counts by role
SELECT 
    role,
    COUNT(*) as count
FROM public.users
GROUP BY role
ORDER BY count DESC;

-- Provider counts by verification status
SELECT 
    verification_status,
    COUNT(*) as count
FROM providers
GROUP BY verification_status
ORDER BY count DESC;

-- Recent registrations (last 10)
SELECT 
    u.email,
    u.role,
    u.full_name,
    u.created_at,
    CASE 
        WHEN u.role = 'artisan' AND p.id IS NOT NULL THEN '✅ Complete'
        WHEN u.role = 'artisan' AND p.id IS NULL THEN '❌ Incomplete'
        ELSE '✅ Complete'
    END as status
FROM public.users u
LEFT JOIN providers p ON p.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Check for orphaned provider profiles (providers without users)
SELECT 
    p.id,
    p.user_id,
    p.business_name,
    '❌ Orphaned (no user)' as issue
FROM providers p
LEFT JOIN public.users u ON u.id = p.user_id
WHERE u.id IS NULL;

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================
-- 
-- 1. FIRST TIME SETUP:
--    - Run all commands in SECTION 1 (Fix Database Schema)
--    - Run SECTION 2 to set up admin user (if needed)
-- 
-- 2. FIX SPECIFIC USER (mediapowers13@gmail.com):
--    - Run SECTION 3 commands one by one
--    - Replace 'PASTE_USER_ID_HERE' with actual UUID
-- 
-- 3. VERIFY EVERYTHING:
--    - Run queries in SECTION 4 to check status
-- 
-- 4. DELETE USER (if needed):
--    - Use SECTION 5 to completely remove a user
--    - Then user can re-register from scratch
-- 
-- 5. FIND ISSUES:
--    - Run SECTION 6 to find incomplete registrations
-- 
-- 6. BULK FIX:
--    - Run SECTION 7 to auto-fix all incomplete registrations
-- 
-- 7. HEALTH CHECK:
--    - Run SECTION 8 anytime to check database status
-- 
-- =====================================================
-- QUICK REFERENCE
-- =====================================================
-- 
-- MOST COMMON COMMANDS:
-- 
-- 1. Add missing columns:
--    Run all ALTER TABLE commands in SECTION 1
-- 
-- 2. Fix one user:
--    a) Get user ID: SELECT id FROM auth.users WHERE email = 'user@email.com';
--    b) Add to public.users (use INSERT from SECTION 3)
--    c) Add provider profile (use INSERT from SECTION 3)
-- 
-- 3. Delete one user:
--    a) Get user ID: SELECT id FROM auth.users WHERE email = 'user@email.com';
--    b) Run DELETE commands from SECTION 5
-- 
-- 4. Check registration status:
--    Run first query in SECTION 4
-- 
-- =====================================================
