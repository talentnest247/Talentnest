import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  // During build time or when environment variables are not properly set,
  // we still need to return a client to prevent build failures
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    console.warn('Using placeholder Supabase configuration. Please set proper environment variables for production.')
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
