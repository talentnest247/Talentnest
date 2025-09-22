// Database schema types for TalentNest - PRD-aligned

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  role: "student" | "provider" | "admin"
  profileImage?: string
  studentId?: string // For student verification
  department?: string
  level?: string
  createdAt: Date
  updatedAt: Date
}

export interface Student extends User {
  role: "student"
  studentId: string
  department: string
  level: string
}

// PRD-aligned Provider (Service Provider) with portfolio and verification
export interface Provider extends User {
  role: "provider"
  businessName: string
  description: string
  bio?: string // Professional bio/background
  specialization: string[] // Categories they work in
  experience: number
  location: string
  rating: number
  totalReviews: number
  verified: boolean
  verificationStatus: "pending" | "approved" | "rejected"
  verificationEvidence?: string[] // Upload URLs for certificates/evidence
  certificates?: string[] // Uploaded certificate URLs
  portfolio: PortfolioItem[]
  availability: {
    isAvailable: boolean
    availableForWork: boolean
    availableForLearning: boolean // Toggle for offering training
    responseTime: string // e.g., "Usually responds within 2 hours"
  }
  pricing: {
    serviceRate?: number
    learningRate?: number // Rate for training/teaching
    currency: string
  }
  whatsappNumber: string // For WhatsApp CTA
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioItem {
  id: string
  providerId: string
  title: string
  description: string
  images: string[]
  category: string
  completedAt: Date
  featured?: boolean // For highlighting best work
}

export interface Booking {
  id: string
  studentId: string
  providerId: string
  serviceType: "direct_service" | "training"
  description: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  bookedAt: Date
  completedAt?: Date
  rating?: number
  review?: string
}

export interface Review {
  id: string
  studentId: string
  providerId: string
  studentName: string
  rating: number
  comment: string
  serviceType: "direct_service" | "training"
  verified: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  providerCount: number
  color?: string
}

// Verification request type with comprehensive verification tracking
export interface VerificationRequest {
  id: string
  providerId: string
  providerName: string
  providerEmail: string
  studentId: string
  matricNumber: string // Student matric number for verification
  department: string
  businessName: string
  businessDescription: string
  bio?: string
  specializations: string[]
  experienceYears: number
  evidenceFiles: {
    url: string
    type: 'portfolio' | 'certificate' | 'student_id'
  }[]
  certificates: string[] // New field for uploaded certificates
  status: "pending" | "approved" | "rejected"
  adminNotes?: string
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  // Individual verification tracking
  matricNumberVerified: boolean
  businessNameVerified: boolean
  certificatesVerified: boolean
  bioVerified: boolean
  verificationComplete: boolean // All requirements met
}

export interface AdminUser extends User {
  role: "admin"
  permissions: string[]
  department?: string
}

// Contact and booking types
export interface ContactRequest {
  id: string
  studentId: string
  providerId: string
  serviceType: "service_booking" | "direct_service"
  contactMethod?: string
  messagePreview?: string
  contactedAt: Date
  responseReceived?: boolean
  responseTimeHours?: number
  bookingCompleted?: boolean
  rating?: number
}

// Analytics types for admin dashboard
export interface PlatformStats {
  totalUsers: number
  totalProviders: number
  totalStudents: number
  pendingVerifications: number
  approvedProviders: number
  rejectedApplications: number
  totalServices: number
  totalEnrollments: number
  monthlyGrowthRate: number
  averageRating: number
}

// Search and filter types
export interface SearchFilters {
  query?: string
  category?: string
  location?: string
  minRating?: number
  verified?: boolean
  availableForLearning?: boolean
  priceRange?: {
    min: number
    max: number
  }
  experience?: {
    min: number
    max: number
  }
}

// WhatsApp integration types
export interface WhatsAppMessage {
  recipientNumber: string
  message: string
  context: {
    studentName: string
    providerName: string
    serviceType: string
    serviceTitle?: string
  }
}

// Supabase function parameter interfaces
export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: "student" | "provider" | "admin"
  profileImage?: string
  studentId?: string
  department?: string
  level?: string
}

export interface CreateProviderData {
  userId: string
  businessName: string
  description: string
  bio?: string
  specialization: string[]
  experience: number
  location: string
  whatsappNumber: string
  verificationEvidence?: string[]
  certificates?: string[]
}

export interface CreatePortfolioData {
  providerId: string
  title: string
  description: string
  images: string[]
  category: string
  completedAt: Date
  featured?: boolean
}

export interface CreateContactData {
  studentId: string
  providerId: string
  message: string
  serviceType: "direct_service" | "training"
}

export interface CreateVerificationData {
  providerId: string
  documents: string[]
  additionalInfo?: string
}

export interface UpdateVerificationData {
  status?: "pending" | "approved" | "rejected"
  adminNotes?: string
  reviewedBy?: string
  reviewedAt?: Date
}
