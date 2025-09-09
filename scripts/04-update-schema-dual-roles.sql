-- TalentNest Enhanced Database Schema for Dual Role Registration
-- This script updates the database to support both students and artisans

-- Create role enum type
CREATE TYPE user_role AS ENUM ('student', 'artisan');

-- Update users table to support dual roles and enhanced registration
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'student',
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS student_id VARCHAR(20), -- For students (matric number)
ADD COLUMN IF NOT EXISTS academic_level VARCHAR(10), -- For students
ADD COLUMN IF NOT EXISTS business_name VARCHAR(100), -- For artisans
ADD COLUMN IF NOT EXISTS specialization VARCHAR(100), -- For artisans
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20), -- For artisans
ADD COLUMN IF NOT EXISTS service_location VARCHAR(100); -- For artisans

-- Make matric_number optional (only for students)
ALTER TABLE public.users ALTER COLUMN matric_number DROP NOT NULL;

-- Update email constraint to allow non-unilorin emails for artisans
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS valid_unilorin_email;

-- Add constraint to ensure student_id is required for students
ALTER TABLE public.users ADD CONSTRAINT student_requires_id 
CHECK (role != 'student' OR student_id IS NOT NULL);

-- Add constraint to ensure business_name is required for artisans
ALTER TABLE public.users ADD CONSTRAINT artisan_requires_business_name 
CHECK (role != 'artisan' OR business_name IS NOT NULL);

-- Add constraint to ensure specialization is required for artisans
ALTER TABLE public.users ADD CONSTRAINT artisan_requires_specialization 
CHECK (role != 'artisan' OR specialization IS NOT NULL);

-- Create unique constraint for student_id when it's not null
CREATE UNIQUE INDEX IF NOT EXISTS users_student_id_unique 
ON public.users (student_id) WHERE student_id IS NOT NULL;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (role);
CREATE INDEX IF NOT EXISTS users_email_verified_idx ON public.users (email_verified);
CREATE INDEX IF NOT EXISTS users_is_active_idx ON public.users (is_active);

-- Update the view for user profiles to include role-specific fields
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.first_name,
  u.last_name,
  u.role,
  u.phone_number,
  u.is_verified,
  u.is_active,
  u.email_verified,
  u.bio,
  u.skills,
  u.total_rating,
  u.total_reviews,
  u.created_at,
  u.updated_at,
  -- Student-specific fields
  CASE WHEN u.role = 'student' THEN u.student_id END as student_id,
  CASE WHEN u.role = 'student' THEN u.department END as department,
  CASE WHEN u.role = 'student' THEN u.academic_level END as academic_level,
  CASE WHEN u.role = 'student' THEN u.faculty::text END as faculty,
  -- Artisan-specific fields
  CASE WHEN u.role = 'artisan' THEN u.business_name END as business_name,
  CASE WHEN u.role = 'artisan' THEN u.specialization END as specialization,
  CASE WHEN u.role = 'artisan' THEN u.experience_level END as experience_level,
  CASE WHEN u.role = 'artisan' THEN u.service_location END as service_location
FROM public.users u;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert or update admin user (if needed)
INSERT INTO public.users (
  id, 
  email, 
  full_name, 
  first_name, 
  last_name, 
  role, 
  is_admin, 
  is_verified, 
  is_active,
  email_verified
) 
VALUES (
  gen_random_uuid(),
  'admin@talentnest.unilorin.edu.ng',
  'TalentNest Admin',
  'Admin',
  'User',
  'student',
  true,
  true,
  true,
  true
) 
ON CONFLICT (email) DO UPDATE SET
  updated_at = NOW();

COMMENT ON TABLE public.users IS 'Enhanced users table supporting both students and artisans';
COMMENT ON COLUMN public.users.role IS 'User role: student or artisan';
COMMENT ON COLUMN public.users.student_id IS 'Matric number for students only';
COMMENT ON COLUMN public.users.business_name IS 'Business/workshop name for artisans only';
COMMENT ON COLUMN public.users.specialization IS 'Artisan specialization/skill area';
COMMENT ON COLUMN public.users.experience_level IS 'Years of experience for artisans';
COMMENT ON COLUMN public.users.service_location IS 'Service delivery location for artisans';
