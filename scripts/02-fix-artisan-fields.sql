-- Fix users table to support both students and artisans
-- Make fields nullable that artisans don't need

-- Drop the NOT NULL constraint on matric_number (artisans don't have matric numbers)
ALTER TABLE public.users ALTER COLUMN matric_number DROP NOT NULL;

-- Drop the NOT NULL constraint on faculty (artisans don't have faculty)
ALTER TABLE public.users ALTER COLUMN faculty DROP NOT NULL;

-- Drop the NOT NULL constraint on department (artisans don't have department)
ALTER TABLE public.users ALTER COLUMN department DROP NOT NULL;

-- Drop the NOT NULL constraint on level (artisans don't have level)
ALTER TABLE public.users ALTER COLUMN level DROP NOT NULL;

-- Remove the unique constraint on matric_number since it can be null
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_matric_number_key;

-- Add a partial unique index that only applies to non-null matric_numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_matric_number_unique 
ON public.users(matric_number) 
WHERE matric_number IS NOT NULL;

-- Remove the UNILORIN email constraint for artisans
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS valid_unilorin_email;

-- Add account_type field to distinguish between students and artisans
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'student';

-- Update existing records to have account_type = 'student'
UPDATE public.users SET account_type = 'student' WHERE account_type IS NULL;

-- Add constraint to ensure account_type is either 'student' or 'artisan'
ALTER TABLE public.users ADD CONSTRAINT valid_account_type 
CHECK (account_type IN ('student', 'artisan'));

-- Add area field for artisan location (this was already in the original schema)
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS area area_type;

-- Create a composite constraint for students to ensure they have required fields
ALTER TABLE public.users ADD CONSTRAINT student_required_fields 
CHECK (
  (account_type = 'artisan') OR 
  (account_type = 'student' AND matric_number IS NOT NULL AND faculty IS NOT NULL AND department IS NOT NULL AND level IS NOT NULL)
);

-- Add check constraint to ensure artisans have area field
ALTER TABLE public.users ADD CONSTRAINT artisan_required_fields 
CHECK (
  (account_type = 'student') OR 
  (account_type = 'artisan' AND area IS NOT NULL)
);