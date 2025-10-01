// Enhanced TypeScript types for TalentNest Marketplace
// This extends the existing types with comprehensive marketplace functionality

import type { AuthUser } from './auth-utils'

export interface EnhancedProfile extends AuthUser {
  portfolio_images?: string[]
  portfolio_videos?: string[]
  portfolio_links?: string[]
  certifications?: string[]
  availability_status: 'online' | 'offline' | 'busy' | 'away'
  available_for_learning: boolean
  verification_status: 'pending' | 'verified' | 'rejected'
  verification_date?: string
  rating_average: number
  total_reviews: number
  total_bookings: number
  hourly_rate?: number
  location_on_campus?: string
  skills_offered?: string[]
  specializations?: string[]
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  icon?: string
  parent_category_id?: string
  created_at: string
  subcategories?: ServiceCategory[]
}

export interface Service {
  id: string
  provider_id: string
  category_id: string
  title: string
  description: string
  price_type: 'fixed' | 'hourly' | 'negotiable'
  base_price?: number
  max_price?: number
  delivery_time?: number // in days
  images?: string[]
  tags?: string[]
  requirements?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Populated fields
  provider?: EnhancedProfile
  category?: ServiceCategory
  reviews?: Review[]
}

export interface ServiceBooking {
  id: string
  service_id: string
  seeker_id: string
  provider_id: string
  title: string
  description: string
  budget?: number
  deadline?: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  payment_status: 'pending' | 'escrowed' | 'released' | 'refunded'
  created_at: string
  updated_at: string
  accepted_at?: string
  completed_at?: string
  // Populated fields
  service?: Service
  seeker?: EnhancedProfile
  provider?: EnhancedProfile
  messages?: Message[]
  transactions?: Transaction[]
}

export interface Message {
  id: string
  booking_id: string
  sender_id: string
  receiver_id: string
  message_type: 'text' | 'image' | 'file' | 'system'
  content?: string
  file_url?: string
  file_name?: string
  is_read: boolean
  created_at: string
  // Populated fields
  sender?: EnhancedProfile
  receiver?: EnhancedProfile
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number // 1-5
  title?: string
  content?: string
  helpful_count: number
  is_verified: boolean
  created_at: string
  updated_at: string
  // Populated fields
  reviewer?: EnhancedProfile
  reviewee?: EnhancedProfile
  booking?: ServiceBooking
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  total_earned: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  wallet_id: string
  booking_id?: string
  transaction_type: 'topup' | 'escrow' | 'release' | 'refund' | 'commission'
  amount: number
  fee: number
  status: 'pending' | 'completed' | 'failed'
  reference: string
  description?: string
  created_at: string
}

export interface LearningSession {
  id: string
  mentor_id: string
  student_id: string
  title: string
  description?: string
  skill_category?: string
  session_type: 'one-on-one' | 'group' | 'workshop'
  duration?: number // in minutes
  price?: number
  scheduled_at?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  location?: string
  meeting_link?: string
  created_at: string
  // Populated fields
  mentor?: EnhancedProfile
  student?: EnhancedProfile
}

export interface Endorsement {
  id: string
  endorser_id: string
  endorsee_id: string
  skill: string
  message?: string
  created_at: string
  // Populated fields
  endorser?: EnhancedProfile
  endorsee?: EnhancedProfile
}

export interface Notification {
  id: string
  user_id: string
  type: 'booking' | 'message' | 'payment' | 'review' | 'endorsement' | 'system'
  title: string
  content?: string
  action_url?: string
  is_read: boolean
  created_at: string
}

export interface Dispute {
  id: string
  booking_id: string
  complainant_id: string
  respondent_id: string
  reason: string
  description: string
  evidence?: string[]
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  admin_notes?: string
  resolved_at?: string
  created_at: string
  // Populated fields
  booking?: ServiceBooking
  complainant?: EnhancedProfile
  respondent?: EnhancedProfile
}

export interface SearchAnalytics {
  id: string
  user_id: string
  search_query?: string
  category_searched?: string
  filters_applied?: Record<string, unknown>
  results_count?: number
  clicked_provider_id?: string
  created_at: string
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category_id?: string
  price_min?: number
  price_max?: number
  rating_min?: number
  verification_status?: 'verified' | 'all'
  availability?: 'online' | 'all'
  location?: string
  delivery_time_max?: number
  sort_by?: 'rating' | 'price_low' | 'price_high' | 'newest' | 'popular'
  page?: number
  limit?: number
}

export interface SearchResults {
  services: Service[]
  providers: EnhancedProfile[]
  total_count: number
  page: number
  limit: number
  total_pages: number
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// Dashboard Analytics Types
export interface ProviderAnalytics {
  total_services: number
  active_bookings: number
  completed_bookings: number
  total_earnings: number
  average_rating: number
  profile_views: number
  response_rate: number
  completion_rate: number
  recent_reviews: Review[]
  earnings_chart: { date: string; amount: number }[]
  booking_chart: { date: string; count: number }[]
}

export interface SeekerAnalytics {
  total_bookings: number
  active_bookings: number
  completed_bookings: number
  total_spent: number
  favorite_categories: { category: string; count: number }[]
  recent_bookings: ServiceBooking[]
  spending_chart: { date: string; amount: number }[]
}

export interface AdminAnalytics {
  total_users: number
  total_providers: number
  total_seekers: number
  total_services: number
  total_bookings: number
  total_revenue: number
  pending_verifications: number
  active_disputes: number
  user_growth: { date: string; count: number }[]
  revenue_chart: { date: string; amount: number }[]
  category_popularity: { category: string; count: number }[]
  top_providers: EnhancedProfile[]
}

// Form Types
export interface ServiceForm {
  title: string
  description: string
  category_id: string
  price_type: 'fixed' | 'hourly' | 'negotiable'
  base_price?: number
  max_price?: number
  delivery_time?: number
  tags: string[]
  requirements?: string
  images?: File[]
}

export interface BookingForm {
  service_id: string
  title: string
  description: string
  budget?: number
  deadline?: string
}

export interface ProfileUpdateForm {
  full_name?: string
  bio?: string
  phone?: string
  department?: string
  student_id?: string
  level?: number
  skills_offered?: string[]
  specializations?: string[]
  hourly_rate?: number
  location_on_campus?: string
  available_for_learning?: boolean
  portfolio_images?: File[]
  portfolio_videos?: File[]
  portfolio_links?: string[]
  certifications?: File[]
}

// Real-time Event Types (for WebSocket/Server-Sent Events)
export interface RealTimeEvent {
  type: 'message' | 'booking_update' | 'notification' | 'status_change'
  user_id: string
  data: unknown
  timestamp: string
}

// Export all existing types from the base types file
export * from './types'