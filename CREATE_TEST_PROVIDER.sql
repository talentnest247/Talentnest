-- =====================================================
-- SAFE TEST PROVIDER CREATION
-- Run this AFTER checking CHECK_DATABASE_STATUS.sql
-- Only run if no providers exist
-- =====================================================

-- This will create ONE test provider with status 'pending'
-- so you can test the approval system

DO $$ 
DECLARE
    provider_count INT;
    artisan_count INT;
    test_user_id UUID;
    test_provider_id UUID;
BEGIN
    -- Count existing providers
    SELECT COUNT(*) INTO provider_count FROM providers;
    SELECT COUNT(*) INTO artisan_count FROM users WHERE role = 'artisan';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Current Status:';
    RAISE NOTICE '  - Total Providers: %', provider_count;
    RAISE NOTICE '  - Total Artisans: %', artisan_count;
    RAISE NOTICE '========================================';
    
    -- Only proceed if no providers exist
    IF provider_count > 0 THEN
        RAISE NOTICE 'Providers already exist! No test data needed.';
        RAISE NOTICE 'Run CHECK_DATABASE_STATUS.sql to see existing providers.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'No providers found. Creating test provider...';
    
    -- Try to find or create test user
    SELECT id INTO test_user_id FROM users WHERE email = 'test.artisan@talentnest.com';
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Using existing test user: %', test_user_id;
    ELSE
        -- Generate new UUID for test user
        test_user_id := gen_random_uuid();
        RAISE NOTICE 'Creating new test user with ID: %', test_user_id;
        
        -- Try to insert into auth.users (may fail if exists)
        BEGIN
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
            RAISE NOTICE '✅ Created user in auth.users';
        EXCEPTION
            WHEN unique_violation THEN
                -- If user exists in auth.users, get the ID
                SELECT id INTO test_user_id FROM auth.users WHERE email = 'test.artisan@talentnest.com';
                RAISE NOTICE '⚠️  User already exists in auth.users, using ID: %', test_user_id;
        END;
        
        -- Insert into public.users (use ON CONFLICT to avoid duplicate errors)
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
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            role = EXCLUDED.role;
        
        RAISE NOTICE '✅ Created/updated user in public.users';
    END IF;
    
    -- Check if provider already exists for this user
    SELECT id INTO test_provider_id FROM providers WHERE user_id = test_user_id;
    
    IF test_provider_id IS NOT NULL THEN
        RAISE NOTICE '⚠️  Provider already exists for this user: %', test_provider_id;
        RAISE NOTICE 'Current status: %', (SELECT verification_status FROM providers WHERE id = test_provider_id);
        RETURN;
    END IF;
    
    -- Create test provider with PENDING status
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
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SUCCESS! Test provider created';
    RAISE NOTICE 'Provider ID: %', test_provider_id;
    RAISE NOTICE 'Status: pending';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Go to: http://localhost:3000/admin/login';
    RAISE NOTICE '2. Login with: talentnest247@gmail.com';
    RAISE NOTICE '3. You should see the test provider in "Pending" tab';
    RAISE NOTICE '4. Click "Approve" to test the approval workflow';
    RAISE NOTICE '========================================';
    
END $$;

-- Verify creation
SELECT 
    '========================================' as divider,
    'VERIFICATION' as section;

SELECT 
    p.id,
    p.business_name,
    p.verification_status,
    p.verified,
    u.email,
    '👉 Should appear in Admin Dashboard > Pending tab' as note
FROM providers p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.verification_status = 'pending'
ORDER BY p.created_at DESC;
