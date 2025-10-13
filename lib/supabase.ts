import { createClient } from '@supabase/supabase-js'
import type { 
  CreateUserData, 
  CreateProviderData, 
  CreatePortfolioData, 
  CreateContactData, 
  CreateVerificationData, 
  UpdateVerificationData 
} from './types'

// Re-export select types for consumers that import from this module
export type { UpdateVerificationData }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Always create clients (even with placeholder values for development)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Log configuration status
if (typeof window === 'undefined') {
  const hasRealUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasRealKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!hasRealUrl || !hasRealKey) {
    console.warn('[supabase] Using placeholder values - configure .env.local for real database access')
  } else {
    console.log('[supabase] Configured with real database')
  }
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown): string {
  const isSupabaseError = (err: unknown): err is { code?: string; message?: string } => {
    return typeof err === 'object' && err !== null
  }

  if (!isSupabaseError(error)) {
    return 'An unexpected error occurred'
  }

  if (error?.code === 'PGRST116') {
    return 'No data found matching your criteria'
  }
  
  if (error?.code === '23505') {
    return 'This record already exists'
  }
  
  if (error?.code === '23503') {
    return 'Cannot complete operation: missing required data'
  }
  
  if (error?.code === '42501') {
    return 'You do not have permission to perform this action'
  }
  
  if (error?.code === 'PGRST301') {
    return 'Invalid request format'
  }
  
  return error?.message || 'An unexpected error occurred'
}

// Get the appropriate client (admin for server operations, regular for client operations)
function getClient() {
  // Use admin client for server-side operations if available
  if (typeof window === 'undefined' && supabaseAdmin) {
    return supabaseAdmin
  }
  return supabase
}

// Database operation wrappers with error handling
export async function safeDbOperation<T>(
  operation: () => Promise<{ data: T | null; error: unknown }>,
  errorMessage: string = 'Database operation failed'
): Promise<T | null> {
  try {
    const { data, error } = await operation()
    if (error) {
      console.error(errorMessage, error)
      return null
    }
    return data
  } catch (err) {
    console.error(errorMessage, err)
    return null
  }
}

// User operations
export async function createUser(userData: CreateUserData) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function getUserById(id: string) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error getting user by ID:', error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw new Error(handleSupabaseError(error))
    }
    return data
  } catch (error) {
    console.error('Error getting user by email:', error)
    throw error
  }
}

// Provider operations
export async function createProvider(providerData: CreateProviderData) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('providers')
      .insert(providerData)
      .select(`
        *,
        user:users!providers_user_id_fkey(*)
      `)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error creating provider:', error)
    throw error
  }
}

export async function getProviders(filters?: {
  specialization?: string
  location?: string
  verified?: boolean
  limit?: number
}) {
  try {
    const client = getClient()
    
    // First, get providers data
    let query = client
      .from('providers')
      .select('*')
    
    if (filters?.specialization) {
      query = query.contains('specialization', [filters.specialization])
    }
    
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    
    if (filters?.verified !== undefined) {
      query = query.eq('verified', filters.verified)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data: providers, error } = await query.order('rating', { ascending: false })
    
    if (error) throw new Error(handleSupabaseError(error))
    
    // If no providers, return empty array
    if (!providers || providers.length === 0) {
      return []
    }
    
    // Get user IDs
    const userIds = providers.map(p => p.user_id).filter(Boolean)
    
    // Fetch user data separately
    const { data: users, error: userError } = await client
      .from('users')
      .select('id, first_name, last_name, profile_image, student_id, email, phone, full_name')
      .in('id', userIds)
    
    if (userError) {
      console.error('Error fetching user data:', userError)
    }
    
    // Merge user data with provider data
    const providersWithUsers = providers.map(provider => ({
      ...provider,
      user: users?.find(u => u.id === provider.user_id) || null
    }))
    
    return providersWithUsers
  } catch (error) {
    console.error('Error getting providers:', error)
    throw error
  }
}

export async function getProviderById(id: string) {
  try {
    const client = getClient()
    
    // Get provider data
    const { data: provider, error } = await client
      .from('providers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    
    if (!provider) {
      throw new Error('Provider not found')
    }
    
    // Get user data separately
    if (provider.user_id) {
      const { data: user, error: userError } = await client
        .from('users')
        .select('*')
        .eq('id', provider.user_id)
        .single()
      
      if (!userError && user) {
        return {
          ...provider,
          user
        }
      }
    }
    
    return provider
  } catch (error) {
    console.error('Error getting provider by ID:', error)
    throw error
  }
}

// Portfolio operations
export async function createPortfolioItem(portfolioData: CreatePortfolioData) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('portfolio')
      .insert(portfolioData)
      .select(`
        *,
        provider:providers(
          *,
          user:profiles(first_name, last_name, profile_image, student_id, email)
        )
      `)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    throw error
  }
}

export async function getPortfolioByProvider(providerId: string) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('portfolio')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(handleSupabaseError(error))
    return data || []
  } catch (error) {
    console.error('Error getting portfolio:', error)
    throw error
  }
}

// Booking operations
export async function createBooking(bookingData: {
  studentId: string
  providerId: string
  serviceType: "direct_service" | "training"
  description: string
}) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('bookings')
      .insert({
        student_id: bookingData.studentId,
        provider_id: bookingData.providerId,
        service_type: bookingData.serviceType,
        description: bookingData.description,
        status: 'pending'
      })
      .select(`
        *,
        student:profiles(first_name, last_name, email, student_id, phone),
        provider:providers(*, user:profiles(first_name, last_name, email))
      `)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export async function getUserBookings(userId: string) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('bookings')
      .select(`
        *,
        provider:providers(*, user:profiles(first_name, last_name, email, student_id))
      `)
      .eq('student_id', userId)
      .order('booked_at', { ascending: false })
    
    if (error) throw new Error(handleSupabaseError(error))
    return data || []
  } catch (error) {
    console.error('Error getting user bookings:', error)
    throw error
  }
}

export async function getProviderBookings(providerId: string) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('bookings')
      .select(`
        *,
        student:profiles(first_name, last_name, email, phone, student_id)
      `)
      .eq('provider_id', providerId)
      .order('booked_at', { ascending: false })
    
    if (error) throw new Error(handleSupabaseError(error))
    return data || []
  } catch (error) {
    console.error('Error getting provider bookings:', error)
    throw error
  }
}

// Contact operations
export async function createContactRequest(contactData: CreateContactData) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('contact_requests')
      .insert(contactData)
      .select(`
        *,
        student:profiles!contact_requests_student_id_fkey(first_name, last_name, email, student_id),
        provider:providers(*, user:profiles(first_name, last_name, email))
      `)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error creating contact request:', error)
    throw error
  }
}

// Verification operations
export async function createVerificationRequest(verificationData: CreateVerificationData) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('verification_requests')
      .insert(verificationData)
      .select(`
        *,
        provider:providers(*, user:profiles(first_name, last_name, email, student_id))
      `)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error creating verification request:', error)
    throw error
  }
}

export async function getVerificationRequests(status?: 'pending' | 'approved' | 'rejected') {
  try {
    const client = getClient()
    let query = client
      .from('verification_requests')
      .select(`
        *,
        provider:providers(
          *,
          user:profiles(first_name, last_name, email, student_id)
        )
      `)
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw new Error(handleSupabaseError(error))
    return data || []
  } catch (error) {
    console.error('Error getting verification requests:', error)
    throw error
  }
}

export async function updateVerificationRequest(id: string, updates: UpdateVerificationData) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('verification_requests')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        provider:providers(*, user:users(first_name, last_name))
      `)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error updating verification request:', error)
    throw error
  }
}

// Categories
export async function getCategories() {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('skills')
      .select('category')
    
    if (error) throw new Error(handleSupabaseError(error))
    
    // Get unique categories
    const uniqueCategories = [...new Set(data?.map((item: { category: string }) => item.category) || [])]
    return uniqueCategories
  } catch (error) {
    console.error('Error getting categories:', error)
    throw error
  }
}

// Reviews
export async function createReview(reviewData: {
  studentId: string
  providerId: string
  bookingId?: string | null
  rating: number
  comment?: string
  serviceType: 'direct_service' | 'training'
}) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('reviews')
      .insert({
        student_id: reviewData.studentId,
        provider_id: reviewData.providerId,
        booking_id: reviewData.bookingId || null,
        rating: reviewData.rating,
        comment: reviewData.comment || null,
        service_type: reviewData.serviceType,
        reviewed_at: new Date().toISOString(),
        verified: true
      })
      .select()
      .single()

    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

export async function getReviews(providerId?: string, limit?: number) {
  try {
    const client = getClient()
    let query = client.from('reviews').select('*')
    if (providerId) query = query.eq('provider_id', providerId)
    if (limit) query = query.limit(limit)
    const { data, error } = await query.order('reviewed_at', { ascending: false })
    if (error) throw new Error(handleSupabaseError(error))
    return data || []
  } catch (error) {
    console.error('Error getting reviews:', error)
    throw error
  }
}

// Presign uploads (simple helper for storage or external S3)
export async function createPresignedUpload(params: { bucket: string; key: string; expiresInSeconds?: number }) {
  try {
    const { bucket, key, expiresInSeconds } = params
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(key, expiresInSeconds || 3600)
      if (error) throw new Error(handleSupabaseError(error))
      return data
    }

    // Fallback: return a mock URL (caller should handle this in dev)
    return { signedUrl: `https://mock-storage.local/${bucket}/${key}`, expiresAt: new Date(Date.now() + (expiresInSeconds || 3600) * 1000).toISOString() }
  } catch (error) {
    console.error('Error creating presigned upload:', error)
    throw error
  }
}

// Admin actions log
export async function logAdminAction(action: { adminId: string; actionType: string; targetId?: string; details?: string }) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('admin_actions_log')
      .insert({
        admin_id: action.adminId,
        action_type: action.actionType,
        target_id: action.targetId || null,
        details: action.details || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(handleSupabaseError(error))
    return data
  } catch (error) {
    console.error('Error logging admin action:', error)
    throw error
  }
}