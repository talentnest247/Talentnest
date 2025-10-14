-- =====================================================
-- COMPLETE FIX FOR PROVIDER APPROVAL SYSTEM
-- Run ALL steps below in Supabase SQL Editor
-- =====================================================

-- ==========================
-- STEP 1: DIAGNOSE THE ISSUE
-- ==========================

-- Check 1: Count providers by status
SELECT 
    'CHECK 1: Provider Counts' as check_name,
    '' as detail;
    
SELECT 
    COALESCE(verification_status, 'NULL') as status,
    COUNT(*) as count
FROM providers
GROUP BY verification_status
UNION ALL
SELECT 'TOTAL', COUNT(*) FROM providers;

-- Check 2: List recent providers
SELECT 
    'CHECK 2: Recent Providers' as check_name,
    '' as detail;

SELECT 
    p.id,
    p.business_name,
    p.verification_status,
    p.verified,
    p.created_at,
    u.email,
    u.full_name
FROM providers p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Check 3: Find artisan users without provider profiles  
SELECT 
    'CHECK 3: Artisans Without Provider Profiles' as check_name,
    '' as detail;

SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.created_at,
    CASE WHEN p.id IS NULL THEN '❌ MISSING' ELSE '✅ EXISTS' END as provider_profile
FROM users u
LEFT JOIN providers p ON u.id = p.user_id
WHERE u.role = 'artisan'
ORDER BY u.created_at DESC;

-- Check 4: Verify RLS policies allow service_role access
SELECT 
    'CHECK 4: RLS Policies on Providers Table' as check_name,
    '' as detail;

SELECT 
    policyname,
    roles,
    cmd as command,
    CASE 
        WHEN policyname LIKE '%service_role%' THEN '✅ Service role policy exists'
        ELSE '⚠️ Check policy details'
    END as status
FROM pg_policies 
WHERE tablename = 'providers'
ORDER BY policyname;

-- ==========================
-- STEP 2: ENSURE CORRECT SCHEMA
-- ==========================

-- Add any missing columns to providers table (optional, based on your needs)
DO $$ 
BEGIN
    -- Add verification_evidence if missing (optional - for storing uploaded documents)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'verification_evidence'
    ) THEN
        ALTER TABLE providers ADD COLUMN verification_evidence TEXT[];
        RAISE NOTICE 'Added verification_evidence column';
    END IF;
    
    -- Add verification_date if missing (optional - for tracking approval date)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'verification_date'
    ) THEN
        ALTER TABLE providers ADD COLUMN verification_date TIMESTAMPTZ;
        RAISE NOTICE 'Added verification_date column';
    END IF;
    
    -- Add verification_admin_notes if missing (optional - for admin feedback)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'verification_admin_notes'
    ) THEN
        ALTER TABLE providers ADD COLUMN verification_admin_notes TEXT;
        RAISE NOTICE 'Added verification_admin_notes column';
    END IF;
    
    -- Add certificates if missing (optional - for storing certificate URLs)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'certificates'
    ) THEN
        ALTER TABLE providers ADD COLUMN certificates TEXT[];
        RAISE NOTICE 'Added certificates column';
    END IF;
    
    RAISE NOTICE 'Schema check complete. All optional columns handled.';
END $$;

-- ==========================
-- STEP 3: ENSURE RLS POLICIES
-- ==========================

-- Drop and recreate service_role policy to ensure it works
DROP POLICY IF EXISTS "Service role full access providers" ON public.providers;
CREATE POLICY "Service role full access providers" 
ON public.providers 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Ensure anyone can view approved providers
DROP POLICY IF EXISTS "Anyone can view approved providers" ON public.providers;
CREATE POLICY "Anyone can view approved providers" 
ON public.providers 
FOR SELECT 
USING (verification_status = 'approved');

-- Ensure providers can view their own profile regardless of status
DROP POLICY IF EXISTS "Users can view own provider profile" ON public.providers;
CREATE POLICY "Users can view own provider profile" 
ON public.providers 
FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure providers can insert their own profile
DROP POLICY IF EXISTS "Users can insert own provider profile" ON public.providers;
CREATE POLICY "Users can insert own provider profile" 
ON public.providers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Ensure providers can update their own profile
DROP POLICY IF EXISTS "Users can update own provider profile" ON public.providers;
CREATE POLICY "Users can update own provider profile" 
ON public.providers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- ==========================
-- STEP 4: CREATE TEST PROVIDER (IF NONE EXIST)
-- ==========================

-- Only create test data if NO providers exist
DO $$ 
DECLARE
    provider_count INT;
    test_user_id UUID;
    test_provider_id UUID;
    user_exists BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO provider_count FROM providers;
    
    IF provider_count = 0 THEN
        RAISE NOTICE 'No providers found. Creating test provider...';
        
        -- Check if test user exists in public.users
        SELECT id INTO test_user_id FROM users WHERE email = 'test.artisan@talentnest.com';
        
        IF test_user_id IS NULL THEN
            -- Check if user exists in auth.users
            SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'test.artisan@talentnest.com') INTO user_exists;
            
            IF user_exists THEN
                -- User exists in auth.users, get the ID
                SELECT id INTO test_user_id FROM auth.users WHERE email = 'test.artisan@talentnest.com';
                RAISE NOTICE 'Found existing auth user with ID: %', test_user_id;
                
                -- Create in public.users only
                INSERT INTO public.users (
                    id,
                    email,
                    full_name,
                    first_name,
                    last_name,
                    phone,
                    role,
                    created_at
                ) VALUES (
                    test_user_id,
                    'test.artisan@talentnest.com',
                    'Test Artisan',
                    'Test',
                    'Artisan',
                    '+2341234567890',
                    'artisan',
                    NOW()
                )
                ON CONFLICT (id) DO NOTHING;
            ELSE
                -- Create brand new user in both tables
                test_user_id := gen_random_uuid();
                
                INSERT INTO auth.users (
                    id,
                    email,
                    encrypted_password,
                    email_confirmed_at,
                    created_at,
                    updated_at,
                    raw_user_meta_data
                ) VALUES (
                    test_user_id,
                    'test.artisan@talentnest.com',
                    crypt('TestPassword123!', gen_salt('bf')),
                    NOW(),
                    NOW(),
                    NOW(),
                    '{"role": "artisan", "full_name": "Test Artisan"}'::jsonb
                );
                
                -- Create in public.users
                INSERT INTO public.users (
                    id,
                    email,
                    full_name,
                    first_name,
                    last_name,
                    phone,
                    role,
                    created_at
                ) VALUES (
                    test_user_id,
                    'test.artisan@talentnest.com',
                    'Test Artisan',
                    'Test',
                    'Artisan',
                    '+2341234567890',
                    'artisan',
                    NOW()
                );
            END IF;
        END IF;
        
        -- Check if provider already exists for this user
        SELECT id INTO test_provider_id FROM providers WHERE user_id = test_user_id;
        
        IF test_provider_id IS NULL THEN
            -- Create test provider
            INSERT INTO public.providers (
                id,
                user_id,
                business_name,
                description,
                bio,
                specialization,
                experience,
                location,
                verification_status,
                verified,
                rating,
                total_reviews,
                availability_available_for_work,
                availability_available_for_learning,
                whatsapp_number,
                pricing_currency,
                created_at
            ) VALUES (
                gen_random_uuid(),
                test_user_id,
                'Test Artisan Services',
                'Professional test provider for approval testing',
                'I am a test artisan for system testing',
                ARRAY['Fashion Design', 'Tailoring'],
                5,
                'University of Ilorin',
                'pending',
                false,
                0,
                0,
                true,
                false,
                '+2341234567890',
                'NGN',
                NOW()
            )
            RETURNING id INTO test_provider_id;
            
            RAISE NOTICE 'Test provider created with ID: %', test_provider_id;
        ELSE
            RAISE NOTICE 'Provider already exists for test user with ID: %', test_provider_id;
        END IF;
    ELSE
        RAISE NOTICE 'Providers already exist (count: %). No test data created.', provider_count;
    END IF;
END $$;

-- ==========================
-- STEP 5: FINAL VERIFICATION
-- ==========================

SELECT 
    '=== FINAL STATUS ===' as status,
    '' as detail;

SELECT 
    CASE 
        WHEN verification_status = 'pending' THEN '⏳ PENDING (needs approval)'
        WHEN verification_status = 'approved' THEN '✅ APPROVED'
        WHEN verification_status = 'rejected' THEN '❌ REJECTED'
        ELSE '⚠️ UNKNOWN STATUS'
    END as status,
    COUNT(*) as count,
    string_agg(business_name, ', ') as providers
FROM providers
GROUP BY verification_status
ORDER BY verification_status;

-- Show what admin dashboard should see
SELECT 
    '=== PROVIDERS ADMIN SHOULD SEE ===' as info,
    '' as detail;

SELECT 
    id,
    business_name,
    verification_status,
    verified,
    location,
    created_at,
    CASE 
        WHEN verification_status = 'pending' THEN '👉 SHOW IN PENDING TAB'
        WHEN verification_status = 'approved' THEN '👉 SHOW IN APPROVED TAB'
        WHEN verification_status = 'rejected' THEN '👉 SHOW IN REJECTED TAB'
    END as admin_display
FROM providers
ORDER BY created_at DESC;
