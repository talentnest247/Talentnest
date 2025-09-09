// Database types for TalentNest

export interface User {
  id: string
  matricNumber: string
  email: string
  fullName: string
  phoneNumber?: string
  whatsappNumber?: string
  faculty?: string
  department?: string
  level?: string
  profileImageUrl?: string
  bio?: string
  skills: string[]
  portfolioLinks: string[]
  isVerified: boolean
  isActive: boolean
  rating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
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
