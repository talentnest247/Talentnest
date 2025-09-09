import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Admin client for server-side operations (use with caution)
export const createAdminClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client should only be used server-side')
  }
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Import types from the main types file
export type { User, Service, Booking, Review, Category } from '../types'

// Database-specific types (matching actual database schema)
export interface DatabaseUser {
  id?: string
  matric_number: string
  email: string
  full_name: string
  phone_number?: string
  whatsapp_number?: string
  faculty: string
  department: string
  level: string
  bio?: string
  skills?: string[]
  portfolio_links?: string[]
  is_verified?: boolean
  is_admin?: boolean
  status?: string
  total_rating?: number
  total_reviews?: number
  created_at?: string
  updated_at?: string
}

export interface DatabaseService {
  id?: string
  provider_id: string
  category_id?: string
  title: string
  description: string
  price: number
  price_type?: string
  delivery_time: string
  requirements?: string
  portfolio_items?: string[]
  status?: string
  views_count?: number
  orders_count?: number
  created_at?: string
  updated_at?: string
}

export interface DatabaseBooking {
  id?: string
  service_id: string
  client_id: string
  provider_id: string
  title: string
  description?: string
  agreed_price?: number
  status?: string
  whatsapp_chat_initiated?: boolean
  delivery_date?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface DatabaseReview {
  id?: string
  booking_id: string
  service_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment?: string
  is_public?: boolean
  created_at?: string
}

// Real-time subscription callback types
export interface RealtimePayload<T = Record<string, unknown>> {
  commit_timestamp: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: T
  old?: T
  schema: string
  table: string
}

// Database helper functions
export const db = {
  // User operations
  users: {
    getById: (id: string) => 
      supabase.from('users').select('*').eq('id', id).single(),
    
    getByEmail: (email: string) =>
      supabase.from('users').select('*').eq('email', email).single(),
    
    getByMatricNumber: (matricNumber: string) =>
      supabase.from('users').select('*').eq('matric_number', matricNumber).single(),
    
    create: (user: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>) =>
      supabase.from('users').insert(user).select().single(),
    
    update: (id: string, updates: Partial<DatabaseUser>) =>
      supabase.from('users').update(updates).eq('id', id).select().single(),
    
    updateRating: (id: string, rating: number, totalReviews: number) =>
      supabase.from('users').update({ total_rating: rating, total_reviews: totalReviews }).eq('id', id)
  },

  // Service operations
  services: {
    getAll: (limit = 12, offset = 0) =>
      supabase
        .from('services')
        .select(`
          *,
          provider:users!provider_id(id, full_name, profile_image_url, total_rating, total_reviews),
          category:service_categories(id, name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
    
    getById: (id: string) =>
      supabase
        .from('services')
        .select(`
          *,
          provider:users!provider_id(id, full_name, profile_image_url, total_rating, total_reviews, phone_number, whatsapp_number, bio),
          category:service_categories(id, name)
        `)
        .eq('id', id)
        .single(),
    
    getByCategory: (categoryId: string, limit = 12, offset = 0) =>
      supabase
        .from('services')
        .select(`
          *,
          provider:users!provider_id(id, full_name, profile_image_url, total_rating, total_reviews),
          category:service_categories(id, name)
        `)
        .eq('category_id', categoryId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
    
    getByProviderId: (providerId: string) =>
      supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false }),
    
    create: (service: Omit<DatabaseService, 'id' | 'created_at' | 'updated_at'>) =>
      supabase.from('services').insert(service).select().single(),
    
    update: (id: string, updates: Partial<DatabaseService>) =>
      supabase.from('services').update(updates).eq('id', id).select().single(),
    
    incrementViews: (id: string) =>
      supabase.rpc('increment_service_views', { service_id: id }),
    
    incrementOrders: (id: string) =>
      supabase.rpc('increment_service_orders', { service_id: id }),
    
    search: (query: string, limit = 12, offset = 0) =>
      supabase
        .from('services')
        .select(`
          *,
          provider:users!provider_id(id, full_name, profile_image_url, total_rating, total_reviews),
          category:service_categories(id, name)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
  },

  // Category operations
  categories: {
    getAll: () =>
      supabase.from('service_categories').select('*').eq('is_active', true).order('name'),
    
    getById: (id: string) =>
      supabase.from('service_categories').select('*').eq('id', id).single()
  },

  // Booking operations
  bookings: {
    getByClientId: (clientId: string) =>
      supabase
        .from('bookings')
        .select(`
          *,
          service:services(id, title, price, delivery_time),
          provider:users!provider_id(id, full_name, profile_image_url, phone_number, whatsapp_number)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false }),
    
    getByProviderId: (providerId: string) =>
      supabase
        .from('bookings')
        .select(`
          *,
          service:services(id, title, price, delivery_time),
          client:users!client_id(id, full_name, profile_image_url, phone_number, whatsapp_number)
        `)
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false }),
    
    getById: (id: string) =>
      supabase
        .from('bookings')
        .select(`
          *,
          service:services(id, title, price, delivery_time),
          client:users!client_id(id, full_name, profile_image_url, phone_number, whatsapp_number),
          provider:users!provider_id(id, full_name, profile_image_url, phone_number, whatsapp_number)
        `)
        .eq('id', id)
        .single(),
    
    create: (booking: Omit<DatabaseBooking, 'id' | 'created_at' | 'updated_at'>) =>
      supabase.from('bookings').insert(booking).select().single(),
    
    updateStatus: (id: string, status: string) =>
      supabase.from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single(),
    
    initiateWhatsApp: (id: string) =>
      supabase.from('bookings').update({ whatsapp_chat_initiated: true }).eq('id', id)
  },

  // Review operations
  reviews: {
    getByBookingId: (bookingId: string) =>
      supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviewer_id(id, full_name, profile_image_url)
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false }),
    
    getByRevieweeId: (revieweeId: string) =>
      supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviewer_id(id, full_name, profile_image_url)
        `)
        .eq('reviewee_id', revieweeId)
        .order('created_at', { ascending: false }),
    
    create: (review: Omit<DatabaseReview, 'id' | 'created_at'>) =>
      supabase.from('reviews').insert(review).select().single()
  }
}

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata?: Record<string, string>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
    })
    return { data, error }
  }
}

// Real-time subscriptions (TODO: Update when needed)
export const subscriptions = {
  subscribeToBookings: (userId: string, callback: (payload: RealtimePayload<DatabaseBooking>) => void) => {
    // Simplified implementation - can be enhanced later
    console.log('Subscribing to bookings for user:', userId)
    console.log('Callback:', callback)
    return { unsubscribe: () => console.log('Unsubscribed') }
  },

  subscribeToServices: (callback: (payload: RealtimePayload<DatabaseService>) => void) => {
    // Simplified implementation - can be enhanced later
    console.log('Subscribing to services')
    console.log('Callback:', callback)
    return { unsubscribe: () => console.log('Unsubscribed') }
  },

  subscribeToUserServices: (userId: string, callback: (payload: RealtimePayload<DatabaseService>) => void) => {
    // Simplified implementation - can be enhanced later
    console.log('Subscribing to user services for user:', userId)
    console.log('Callback:', callback)
    return { unsubscribe: () => console.log('Unsubscribed') }
  }
}
