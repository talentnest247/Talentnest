import { createClient } from '@supabase/supabase-js'
import type { 
  CreateUserData, 
  CreateProviderData, 
  CreatePortfolioData, 
  CreateContactData, 
  CreateVerificationData, 
  UpdateVerificationData 
} from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
}

// Create Supabase client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Create admin client for server-side operations that bypass RLS
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown): string {
  // Type guard for error objects with expected properties
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
        user:users(*)
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
    let query = client
      .from('providers')
      .select(`
        *,
        user:users(first_name, last_name, profile_image)
      `)
      .eq('availability_is_available', true)
    
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
    
    const { data, error } = await query.order('rating', { ascending: false })
    
    if (error) throw new Error(handleSupabaseError(error))
    return data || []
  } catch (error) {
    console.error('Error getting providers:', error)
    throw error
  }
}

export async function getProviderById(id: string) {
  try {
    const client = getClient()
    const { data, error } = await client
      .from('providers')
      .select(`
        *,
        user:users(*),
        skills(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw new Error(handleSupabaseError(error))
    return data
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
          user:users(first_name, last_name, profile_image)
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
        student:users(first_name, last_name, email),
        provider:providers(*, user:users(first_name, last_name))
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
        provider:providers(*, user:users(first_name, last_name))
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
        student:users(first_name, last_name, email, phone)
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
        student:users!contact_requests_student_id_fkey(first_name, last_name, email),
        provider:providers(*, user:users(first_name, last_name))
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
        provider:providers(*, user:users(first_name, last_name))
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
          user:users(first_name, last_name, email)
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
