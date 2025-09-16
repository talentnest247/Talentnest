// Database types for TalentNest

export interface User {
  id: string
  email: string
  fullName: string
  matricNumber?: string // Optional for artisans
  phoneNumber?: string
  whatsappNumber?: string
  faculty?: string
  department?: string
  level?: string
  profileImageUrl?: string
  bio?: string
  experience?: string
  skills: string[]
  portfolioLinks: string[]
  certificates: string[] // Certificate upload URLs
  accountType: "student" | "artisan"
  isVerified: boolean
  isActive: boolean
  verificationStatus: "pending" | "verified" | "rejected"
  verificationNotes?: string // Admin feedback for verification
  rating: number
  totalReviews: number
  status: "active" | "pending" | "verified" | "suspended"
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  userId: string
  title: string
  description: string
  category: string
  subcategory?: string
  priceRange: string
  deliveryTime: string
  images: string[]
  tags: string[]
  isActive: boolean
  status: "active" | "pending" | "rejected" | "flagged"
  viewsCount: number
  ordersCount: number
  rating: number
  totalReviews: number
  whatsappNumber?: string // For direct contact
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
  fullName: string
  matricNumber: string
  phoneNumber: string
  whatsappNumber: string
  faculty: string
  department: string
  level: string
  state: string
  password: string
  confirmPassword: string
}

export interface ArtisanSignupFormData {
  email: string
  fullName: string
  phoneNumber: string
  whatsappNumber: string
  bio: string
  experience: string
  skills: string[]
  portfolioLinks: string[]
  certificates: File[]
  password: string
  confirmPassword: string
}

export interface SignupFormData {
  matricNumber: string
  email: string
  fullName: string
  phoneNumber: string
  whatsappNumber: string
  faculty: string
  department: string
  level: string
  password: string
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

// Artisan registration form data
export interface ArtisanSignupFormData {
  email: string
  fullName: string
  phoneNumber: string
  whatsappNumber: string
  bio: string
  experience: string
  skills: string[]
  portfolioLinks: string[]
  certificates: File[]
  password: string
  confirmPassword: string
}


