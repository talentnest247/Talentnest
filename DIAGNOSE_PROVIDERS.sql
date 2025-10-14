-- =====================================================
-- DIAGNOSTIC SCRIPT FOR PROVIDER APPROVAL SYSTEM
-- Run this in Supabase SQL Editor to check provider status
-- =====================================================

-- 1. Count all providers by status
SELECT 
  'Total Providers' as metric,
  COUNT(*) as count
FROM providers
UNION ALL
SELECT 
  'Pending Providers',
  COUNT(*)
FROM providers 
WHERE verification_status = 'pending'
UNION ALL
SELECT
  'Approved Providers',
  COUNT(*)
FROM providers
WHERE verification_status = 'approved'
UNION ALL
SELECT
  'Rejected Providers',
  COUNT(*)
FROM providers
WHERE verification_status = 'rejected';

-- 2. Show recent providers with details
SELECT 
  p.id,
  p.business_name,
  p.verification_status,
  p.verified,
  p.created_at,
  u.email,
  u.full_name,
  u.role
FROM providers p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- 3. Check if any providers exist at all
SELECT CASE 
  WHEN EXISTS (SELECT 1 FROM providers) 
  THEN 'YES - Providers table has data'
  ELSE 'NO - Providers table is empty'
END as providers_exist;

-- 4. Check recent user registrations with artisan role
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM users
WHERE role = 'artisan'
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check if users with artisan role have matching provider profiles
SELECT 
  u.email,
  u.full_name,
  u.role,
  u.created_at as user_created,
  p.business_name,
  p.verification_status,
  p.created_at as provider_created,
  CASE 
    WHEN p.id IS NULL THEN 'MISSING - No provider profile!'
    ELSE 'OK - Provider profile exists'
  END as profile_status
FROM users u
LEFT JOIN providers p ON u.user_id = p.user_id
WHERE u.role = 'artisan'
ORDER BY u.created_at DESC
LIMIT 10;
