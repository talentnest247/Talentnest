// Database types for TalentNest

export type UserRole = 'student' | 'artisan' | 'admin'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  phone?: string
  created_at: string
  updated_at: string
  // Student specific fields
  matric_number?: string
  faculty?: string
  department?: string
  level?: string
  field_of_study?: string
  year_of_study?: number
  school?: string
  // Common fields
  profile_image_url?: string
  bio?: string
  skills?: string[]
  portfolio_links?: string[]
  is_verified: boolean
  is_active: boolean
  rating: number
  total_reviews: number
}

export interface ArtisanProfile {
  id: string
  user_id: string
  matric_number: string
  business_name: string
  business_registration_number?: string
  trade_category: string
  years_of_experience: number
  location: string
  description: string
  verification_status: VerificationStatus
  verification_notes?: string
  verified_at?: string
  verified_by?: string
  created_at: string
  updated_at: string
}

export interface ArtisanDocument {
  id: string
  artisan_id: string
  document_type: 'business_certificate' | 'id_document' | 'trade_certificate' | 'portfolio' | 'other'
  file_url: string
  file_name: string
  file_size: number
  uploaded_at: string
}

export interface Student extends User {
  role: 'student'
}

export interface Artisan extends User {
  role: 'artisan'
  profile?: ArtisanProfile
  documents?: ArtisanDocument[]
}

export interface Service {
  id: string
  userId: string
  title: string
  description: string
  category: "digital" | "artisan" | "tutoring"
  subcategory?: string
  priceRange: string
  deliveryTime: string
  images: string[]
  tags: string[]
  isActive: boolean
  viewsCount: number
  ordersCount: number
  createdAt: string
  updatedAt: string
  user?: User // Populated user data
}

export interface Booking {
  id: string
  serviceId: string
  clientId: string
  providerId: string
  title: string
  description?: string
  agreedPrice?: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  whatsappChatInitiated: boolean
  deliveryDate?: string
  createdAt: string
  updatedAt: string
  service?: Service
  client?: User
  provider?: User
}

export interface Review {
  id: string
  bookingId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment?: string
  createdAt: string
  reviewer?: User
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  isActive: boolean
}

// Form types
export interface StudentSignupFormData {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  phone: string
  matric_number?: string
  faculty?: string
  department?: string
  level?: string
  field_of_study?: string
  year_of_study?: number
  school?: string
}

export interface ArtisanSignupFormData {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  matric_number: string
  phone: string
  business_name: string
  business_registration_number?: string
  trade_category: string
  years_of_experience: number
  location: string
  description: string
  documents: File[]
  certificate: File | null
  bio_document: File | null
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ServiceFormData {
  title: string
  description: string
  category: string
  subcategory?: string
  priceRange: string
  deliveryTime: string
  tags: string[]
}
