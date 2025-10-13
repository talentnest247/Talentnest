-- =====================================================
-- FIX MISSING COLUMNS IN USERS TABLE
-- =====================================================
-- This script adds missing columns to the users table
-- Run this in your Supabase SQL Editor

-- Check if columns exist and add them if missing
DO $$ 
BEGIN
    -- Add student_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'student_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN student_id VARCHAR(50);
        RAISE NOTICE '✅ Added student_id column';
    ELSE
        RAISE NOTICE '✅ student_id column already exists';
    END IF;

    -- Add department column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'department'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN department VARCHAR(100);
        RAISE NOTICE '✅ Added department column';
    ELSE
        RAISE NOTICE '✅ department column already exists';
    END IF;

    -- Add level column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'level'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN level INTEGER;
        RAISE NOTICE '✅ Added level column';
    ELSE
        RAISE NOTICE '✅ level column already exists';
    END IF;

    -- Add avatar_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'avatar_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN avatar_url TEXT;
        RAISE NOTICE '✅ Added avatar_url column';
    ELSE
        RAISE NOTICE '✅ avatar_url column already exists';
    END IF;

    -- Add bio column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'bio'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN bio TEXT;
        RAISE NOTICE '✅ Added bio column';
    ELSE
        RAISE NOTICE '✅ bio column already exists';
    END IF;

END $$;

-- Verify the columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
    AND table_schema = 'public'
    AND column_name IN ('student_id', 'department', 'level', 'avatar_url', 'bio')
ORDER BY column_name;

-- Show success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '✅ USERS TABLE SCHEMA UPDATED!';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'All required columns are now present in the users table.';
    RAISE NOTICE 'You can now register artisans and students without errors.';
    RAISE NOTICE '==========================================';
END $$;
