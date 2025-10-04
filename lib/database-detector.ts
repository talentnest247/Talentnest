/**
 * Database Table Detection Utility
 * Automatically detects whether to use 'users' or 'profiles' table
 */

import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

let cachedUserTable: 'users' | 'profiles' | null = null
let cachedProviderTable: 'providers' | 'artisans' | null = null

/**
 * Detect which user table exists in the database
 */
export async function getUserTableName(): Promise<'users' | 'profiles'> {
  if (cachedUserTable) return cachedUserTable

  // Try users table first
  const { error: usersError } = await supabaseAdmin
    .from('users')
    .select('id')
    .limit(1)

  if (!usersError || usersError.code !== 'PGRST205') {
    cachedUserTable = 'users'
    return 'users'
  }

  // Fall back to profiles
  cachedUserTable = 'profiles'
  return 'profiles'
}

/**
 * Detect which provider table exists in the database
 */
export async function getProviderTableName(): Promise<'providers' | 'artisans'> {
  if (cachedProviderTable) return cachedProviderTable

  // Try providers table first
  const { error: providersError } = await supabaseAdmin
    .from('providers')
    .select('id')
    .limit(1)

  if (!providersError || providersError.code !== 'PGRST205') {
    cachedProviderTable = 'providers'
    return 'providers'
  }

  // Fall back to artisans
  cachedProviderTable = 'artisans'
  return 'artisans'
}

/**
 * Get field mapping for user table
 * Maps standard field names to actual database column names
 */
export function getUserFieldMapping(tableName: 'users' | 'profiles') {
  if (tableName === 'users') {
    return {
      profile_image: 'profile_image',
      student_id: 'student_id',
      department: 'department',
      level: 'level'
    }
  } else {
    return {
      profile_image: 'avatar_url',
      student_id: 'student_id',
      department: 'department',
      level: 'level'
    }
  }
}

/**
 * Get experience field name for provider table
 */
export function getProviderFieldMapping(tableName: 'providers' | 'artisans') {
  if (tableName === 'providers') {
    return {
      experience: 'experience_years',
      verified: 'verified',
      verification_status: 'verification_status'
    }
  } else {
    return {
      experience: 'experience',
      verified: 'verified',
      verification_status: 'verification_status'
    }
  }
}
