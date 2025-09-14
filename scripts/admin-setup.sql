-- Admin Setup Script
-- Run this in your Supabase SQL Editor to set up the admin user

-- Function to make a user admin
CREATE OR REPLACE FUNCTION public.make_admin(user_email TEXT)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  result JSON;
BEGIN
  -- Check if user exists
  SELECT * INTO user_record FROM public.users WHERE email = user_email;
  
  IF NOT FOUND THEN
    -- Return error if user doesn't exist
    result := json_build_object(
      'success', false,
      'message', 'User not found with email: ' || user_email,
      'action', 'Please register first, then run this function'
    );
    RETURN result;
  END IF;
  
  -- Update user to admin
  UPDATE public.users 
  SET 
    role = 'admin',
    is_verified = TRUE,
    is_active = TRUE,
    updated_at = NOW()
  WHERE email = user_email;
  
  result := json_build_object(
    'success', true,
    'message', 'Successfully made ' || user_email || ' an admin',
    'user_id', user_record.id,
    'user_name', user_record.full_name
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make talentnest247@gmail.com an admin (run this after the user registers)
-- SELECT public.make_admin('talentnest247@gmail.com');

-- Check admin status
CREATE OR REPLACE FUNCTION public.check_admin_status(user_email TEXT)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  result JSON;
BEGIN
  SELECT id, email, full_name, role, is_verified, is_active, created_at 
  INTO user_record 
  FROM public.users 
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    result := json_build_object(
      'success', false,
      'message', 'User not found with email: ' || user_email
    );
  ELSE
    result := json_build_object(
      'success', true,
      'user', json_build_object(
        'id', user_record.id,
        'email', user_record.email,
        'full_name', user_record.full_name,
        'role', user_record.role,
        'is_verified', user_record.is_verified,
        'is_active', user_record.is_active,
        'created_at', user_record.created_at
      )
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage examples:
-- To check if admin exists: SELECT public.check_admin_status('talentnest247@gmail.com');
-- To make user admin: SELECT public.make_admin('talentnest247@gmail.com');

-- Create the default admin user data (this will be used by the trigger)
-- Note: The actual user must register first through the normal registration process
-- Then run: SELECT public.make_admin('talentnest247@gmail.com');

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.make_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_admin_status(TEXT) TO authenticated;

-- Example output after running make_admin:
-- {
--   "success": true,
--   "message": "Successfully made talentnest247@gmail.com an admin",
--   "user_id": "uuid-here",
--   "user_name": "Admin Name"
-- }
