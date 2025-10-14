-- =====================================================
-- ADD MISSING COLUMNS TO PROVIDERS TABLE
-- Run this in Supabase SQL Editor to add the columns back
-- =====================================================

-- Add all the columns that were being used but don't exist yet
DO $$ 
BEGIN
    -- Add verification_evidence column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'verification_evidence'
    ) THEN
        ALTER TABLE providers ADD COLUMN verification_evidence TEXT[] DEFAULT '{}';
        RAISE NOTICE '✅ Added verification_evidence column';
    ELSE
        RAISE NOTICE '⚠️  verification_evidence already exists';
    END IF;
    
    -- Add verification_date column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'verification_date'
    ) THEN
        ALTER TABLE providers ADD COLUMN verification_date TIMESTAMPTZ;
        RAISE NOTICE '✅ Added verification_date column';
    ELSE
        RAISE NOTICE '⚠️  verification_date already exists';
    END IF;
    
    -- Add verification_admin_notes column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'verification_admin_notes'
    ) THEN
        ALTER TABLE providers ADD COLUMN verification_admin_notes TEXT;
        RAISE NOTICE '✅ Added verification_admin_notes column';
    ELSE
        RAISE NOTICE '⚠️  verification_admin_notes already exists';
    END IF;
    
    -- Add certificates column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'providers' AND column_name = 'certificates'
    ) THEN
        ALTER TABLE providers ADD COLUMN certificates TEXT[] DEFAULT '{}';
        RAISE NOTICE '✅ Added certificates column';
    ELSE
        RAISE NOTICE '⚠️  certificates already exists';
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ All provider columns added successfully!';
    RAISE NOTICE '========================================';
END $$;

-- Add columns to users table for student information
DO $$ 
BEGIN
    -- Add student_id column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'student_id'
    ) THEN
        ALTER TABLE users ADD COLUMN student_id TEXT;
        RAISE NOTICE '✅ Added student_id column to users table';
    ELSE
        RAISE NOTICE '⚠️  student_id already exists in users table';
    END IF;
    
    -- Add department column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'department'
    ) THEN
        ALTER TABLE users ADD COLUMN department TEXT;
        RAISE NOTICE '✅ Added department column to users table';
    ELSE
        RAISE NOTICE '⚠️  department already exists in users table';
    END IF;
    
    -- Add level column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'level'
    ) THEN
        ALTER TABLE users ADD COLUMN level INTEGER;
        RAISE NOTICE '✅ Added level column to users table';
    ELSE
        RAISE NOTICE '⚠️  level already exists in users table';
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ All user columns added successfully!';
    RAISE NOTICE '========================================';
END $$;

-- Verify all columns exist
SELECT 
    '========================================' as divider,
    'COLUMN VERIFICATION' as section;

SELECT 
    column_name,
    data_type,
    '✅ EXISTS' as status
FROM information_schema.columns 
WHERE table_name = 'providers' 
AND column_name IN (
    'verification_evidence',
    'verification_date',
    'verification_admin_notes',
    'certificates'
)
ORDER BY column_name;

SELECT 
    column_name,
    data_type,
    '✅ EXISTS' as status
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN (
    'student_id',
    'department',
    'level'
)
ORDER BY column_name;

SELECT 
    '========================================' as divider,
    'SUCCESS! All columns added.' as message;
