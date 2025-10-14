-- =====================================================
-- URGENT FIX: Add Missing Columns to Users Table
-- Run this NOW to fix login issues
-- =====================================================

-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER;

-- Update the handle_new_user function to include all fields
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, first_name, last_name, phone, student_id, department, level, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'student_id',
    NEW.raw_user_meta_data->>'department',
    CASE WHEN NEW.raw_user_meta_data->>'level' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'level')::INTEGER 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    student_id = COALESCE(EXCLUDED.student_id, public.users.student_id),
    department = COALESCE(EXCLUDED.department, public.users.department),
    level = COALESCE(EXCLUDED.level, public.users.level),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sync existing auth.users data to new columns
UPDATE public.users u
SET 
  student_id = (SELECT au.raw_user_meta_data->>'student_id' FROM auth.users au WHERE au.id = u.id),
  department = (SELECT au.raw_user_meta_data->>'department' FROM auth.users au WHERE au.id = u.id),
  level = (SELECT CASE WHEN au.raw_user_meta_data->>'level' IS NOT NULL 
                  THEN (au.raw_user_meta_data->>'level')::INTEGER 
                  ELSE NULL END FROM auth.users au WHERE au.id = u.id),
  first_name = (SELECT au.raw_user_meta_data->>'first_name' FROM auth.users au WHERE au.id = u.id),
  last_name = (SELECT au.raw_user_meta_data->>'last_name' FROM auth.users au WHERE au.id = u.id),
  phone = (SELECT au.raw_user_meta_data->>'phone' FROM auth.users au WHERE au.id = u.id)
WHERE EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ HOTFIX APPLIED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Added columns: student_id, department, level';
  RAISE NOTICE 'Updated handle_new_user() function';
  RAISE NOTICE 'Synced existing user data';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 You can now login successfully!';
  RAISE NOTICE 'Try logging in again at /login';
  RAISE NOTICE '========================================';
END $$;
