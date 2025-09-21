// Database schema types for the University of Ilorin Artisan Community Platform (PRD-aligned)

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  fullName: string
  phone: string
  role: "student" | "artisan" | "admin"
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
  enrolledSkills: string[]
}

// PRD-aligned Provider (Artisan) with portfolio and verification
export interface Provider extends User {
  role: "artisan"
  businessName: string
  description: string
  bio?: string // Professional bio/background
  specialization: string[]
  experience: number
  location: string
  rating: number
  totalReviews: number
  verified: boolean
  verificationStatus: "pending" | "approved" | "rejected"
  verificationEvidence?: string[] // Upload URLs for certificates/evidence
  certificates?: string[] // Uploaded certificate URLs
  portfolio: PortfolioItem[]
  skills: Skill[]
  availability: {
    isAvailable: boolean
    availableForWork: boolean
    availableForLearning: boolean
    responseTime: string // e.g., "Usually responds within 2 hours"
  }
  pricing: {
    baseRate?: number
    learningRate?: number
    currency: string
  }
  whatsappNumber: string // For WhatsApp CTA
}

// Legacy alias for backward compatibility
export interface Artisan extends Provider {}

export interface Skill {
  id: string
  artisanId: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  price: number
  maxStudents: number
  currentStudents: number
  images: string[]
  syllabus: string[]
  requirements: string[]
  instructor: {
    id: string
    name: string
    image: string
    rating: number
    businessName: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  completedAt: Date
}

export interface Enrollment {
  id: string
  studentId: string
  skillId: string
  providerId: string  // Updated from artisanId to providerId
  status: "pending" | "active" | "completed" | "cancelled"
  progress: number
  enrolledAt: Date
  completedAt?: Date
}

export interface Review {
  id: string
  studentId: string
  artisanId: string
  skillId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  skillCount: number
  providerCount: number
  artisanCount?: number // Optional for compatibility
  skills?: string[] // Optional popular skills array
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
  serviceType: "skill_learning" | "direct_service"
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
  totalSkills: number
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
    skillTitle?: string
  }
}
