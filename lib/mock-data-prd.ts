// Simplified mock data for TalentNest - PRD aligned with inclusive categories
import type { Provider } from "./types"

// Simplified provider type for display purposes
export interface SimpleProvider {
  id: string
  name: string
  category_name: string
  category_id: number
  bio: string
  location: string
  profile_picture: string
  portfolio: {
    id: string
    providerId: string
    title: string
    description: string
    images: string[]
    category: string
    completedAt: Date
    featured?: boolean
  }[]
  contact: {
    whatsapp: string
    email: string
    phone: string
  }
  verified: boolean
  badge: string | null
  rating: number
  reviews_count: number
  available_for_learning: boolean
  offer_paid_sessions: boolean
  available_for_hire: boolean
  offer_consultation: boolean
  response_time: string
}

export const SAMPLE_CATEGORIES = [
  {
    id: 1,
    name: 'Creative Services',
    slug: 'creative-services',
    description: 'Graphic design, photography, content creation, and artistic services',
    icon: 'Palette',
    color: '#EC4899'
  },
  {
    id: 2,
    name: 'Tech & Digital',
    slug: 'tech-digital',
    description: 'Web development, app creation, digital marketing, and tech support',
    icon: 'Laptop',
    color: '#3B82F6'
  },
  {
    id: 3,
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Hair styling, makeup, skincare, and personal wellness services',
    icon: 'Sparkles',
    color: '#8B5CF6'
  },
  {
    id: 4,
    name: 'Fashion & Style',
    slug: 'fashion-style',
    description: 'Clothing design, tailoring, styling, and fashion consultation',
    icon: 'Scissors',
    color: '#F59E0B'
  },
  {
    id: 5,
    name: 'Home Services',
    slug: 'home-services',
    description: 'Cleaning, organization, maintenance, and home improvement',
    icon: 'Home',
    color: '#10B981'
  },
  {
    id: 6,
    name: 'Food & Catering',
    slug: 'food-catering',
    description: 'Cooking, baking, meal prep, and event catering services',
    icon: 'ChefHat',
    color: '#F97316'
  },
  {
    id: 7,
    name: 'Tutoring & Education',
    slug: 'tutoring-education',
    description: 'Academic tutoring, skill teaching, and educational support',
    icon: 'BookOpen',
    color: '#6366F1'
  },
  {
    id: 8,
    name: 'Event Services',
    slug: 'event-services',
    description: 'Event planning, decoration, photography, and entertainment',
    icon: 'Calendar',
    color: '#84CC16'
  },
  {
    id: 9,
    name: 'Writing & Content',
    slug: 'writing-content',
    description: 'Copywriting, editing, translation, and content creation',
    icon: 'PenTool',
    color: '#059669'
  },
  {
    id: 10,
    name: 'Business Support',
    slug: 'business-support',
    description: 'Virtual assistance, data entry, social media management',
    icon: 'Briefcase',
    color: '#6B7280'
  },
  {
    id: 11,
    name: 'Fitness & Sports',
    slug: 'fitness-sports',
    description: 'Personal training, sports coaching, and fitness consultation',
    icon: 'Dumbbell',
    color: '#EF4444'
  },
  {
    id: 12,
    name: 'Other Services',
    slug: 'other-services',
    description: 'Miscellaneous services and specialized offerings',
    icon: 'MoreHorizontal',
    color: '#64748B'
  }
];

export const SAMPLE_PROVIDERS: SimpleProvider[] = [
  {
    id: "1",
    name: "Sarah Design Studios",
    category_name: "Creative Services",
    category_id: 1,
    bio: "Professional graphic designer specializing in brand identity, web design, and digital marketing materials. I help businesses create stunning visual content that connects with their audience.",
    location: "Lagos, Nigeria",
    profile_picture: "/placeholder-user.jpg",
    portfolio: [
      {
        id: "portfolio-1-1",
        providerId: "1",
        title: "Brand Identity Package",
        description: "Complete brand identity for tech startup including logo, business cards, and style guide",
        images: ["/placeholder.svg"],
        category: "Creative Services",
        completedAt: new Date("2024-01-15"),
        featured: true
      },
      {
        id: "portfolio-1-2", 
        providerId: "1",
        title: "Website Design",
        description: "Modern, responsive website design for e-commerce business",
        images: ["/placeholder.svg"],
        category: "Creative Services",
        completedAt: new Date("2024-01-10"),
        featured: false
      }
    ],
    contact: {
      whatsapp: "+2349012345678",
      email: "sarah@designstudios.com",
      phone: "+2349012345678"
    },
    verified: true,
    badge: "Expert",
    rating: 4.9,
    reviews_count: 47,
    available_for_learning: true,
    offer_paid_sessions: true,
    available_for_hire: true,
    offer_consultation: true,
    response_time: "Within 2 hours"
  },
  {
    id: "2",
    name: "TechMaster Solutions",
    category_name: "Tech & Digital",
    category_id: 2,
    bio: "Full-stack developer and digital marketing expert. I build web applications, mobile apps, and provide comprehensive digital solutions for businesses.",
    location: "Abuja, Nigeria",
    profile_picture: "/young-man-technician.png",
    portfolio: [
      {
        id: "portfolio-2-1",
        providerId: "2",
        title: "E-commerce Platform",
        description: "Custom e-commerce solution with payment integration and inventory management",
        images: ["/placeholder.svg"],
        category: "Tech & Digital",
        completedAt: new Date("2024-01-12"),
        featured: true
      },
      {
        id: "portfolio-2-2",
        providerId: "2", 
        title: "Mobile App Development",
        description: "Cross-platform mobile app for food delivery service",
        images: ["/placeholder.svg"],
        category: "Tech & Digital",
        completedAt: new Date("2024-01-08"),
        featured: false
      }
    ],
    contact: {
      whatsapp: "+2349087654321",
      email: "info@techmastersolutions.com",
      phone: "+2349087654321"
    },
    verified: true,
    badge: "Professional",
    rating: 4.8,
    reviews_count: 32,
    available_for_learning: true,
    offer_paid_sessions: true,
    available_for_hire: true,
    offer_consultation: true,
    response_time: "Within 4 hours"
  },
  {
    id: "3",
    name: "Glamour Beauty Hub",
    category_name: "Beauty & Wellness",
    category_id: 3,
    bio: "Professional makeup artist and beauty consultant with 8+ years experience. Specializing in bridal makeup, special events, and beauty training.",
    location: "Port Harcourt, Nigeria",
    profile_picture: "/professional-woman-tailor.png",
    portfolio: [
      {
        id: "portfolio-3-1",
        providerId: "3",
        title: "Bridal Makeup Package",
        description: "Complete bridal makeup including trial session and wedding day application",
        images: ["/placeholder.svg"],
        category: "Beauty & Wellness",
        completedAt: new Date("2024-01-14"),
        featured: true
      },
      {
        id: "portfolio-3-2",
        providerId: "3",
        title: "Makeup Masterclass",
        description: "Professional makeup training course covering basic to advanced techniques",
        images: ["/placeholder.svg"],
        category: "Beauty & Wellness",
        completedAt: new Date("2024-01-11"),
        featured: false
      }
    ],
    contact: {
      whatsapp: "+2349023456789",
      email: "info@glamourbeautyhub.com",
      phone: "+2349023456789"
    },
    verified: true,
    badge: "Expert",
    rating: 4.9,
    reviews_count: 68,
    available_for_learning: true,
    offer_paid_sessions: true,
    available_for_hire: true,
    offer_consultation: true,
    response_time: "Within 1 hour"
  }
];

// Additional mock providers with student-friendly formats  
export const mockProviders: Provider[] = [
  {
    id: "1",
    email: "fatima@unilorin.edu.ng",
    password: "hashedpassword",
    firstName: "Fatima",
    lastName: "Abubakar",
    fullName: "Fatima Abubakar",
    phone: "08012345678",
    role: "provider",
    profileImage: "/professional-woman-tailor.png",
    studentId: "19/52HA009",
    department: "Home Economics",
    level: "400L",
    businessName: "Fatima's Fashion Hub",
    description: "Expert tailor specializing in traditional and modern clothing",
    bio: "Professional fashion designer with 3+ years experience in creating stunning traditional and contemporary outfits.",
    specialization: ["Fashion & Style", "Traditional Wear"],
    experience: 3,
    location: "Ilorin East",
    rating: 4.8,
    totalReviews: 24,
    verified: true,
    verificationStatus: "approved",
    certificates: ["/cert1.jpg"],
    portfolio: [
      {
        id: "p1",
        providerId: "1",
        title: "Traditional Agbada Collection",
        description: "Custom-made traditional Agbada for special occasions",
        images: ["/traditional-agbada.png"],
        category: "Traditional Wear",
        completedAt: new Date("2024-01-15"),
        featured: true
      }
    ],
    availability: {
      isAvailable: true,
      availableForWork: true,
      availableForLearning: true,
      responseTime: "Usually responds within 2 hours"
    },
    pricing: {
      serviceRate: 15000,
      learningRate: 5000,
      currency: "NGN"
    },
    whatsappNumber: "08012345678",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2", 
    email: "ibrahim@unilorin.edu.ng",
    password: "hashedpassword",
    firstName: "Ibrahim",
    lastName: "Musa",
    fullName: "Ibrahim Musa",
    phone: "08087654321",
    role: "provider",
    profileImage: "/young-man-technician.png",
    studentId: "20/52HA015",
    department: "Computer Science",
    level: "300L", 
    businessName: "Tech Solutions NG",
    description: "Professional phone and laptop repair specialist",
    bio: "Certified technician with expertise in mobile and computer repairs.",
    specialization: ["Tech & Digital", "Mobile Repairs"],
    experience: 2,
    location: "Ilorin West",
    rating: 4.6,
    totalReviews: 18,
    verified: true,
    verificationStatus: "approved",
    certificates: ["/tech-cert.jpg"],
    portfolio: [
      {
        id: "p2",
        providerId: "2",
        title: "Phone Repair Portfolio",
        description: "Professional mobile device repairs and maintenance",
        images: ["/phone-repair.jpg"],
        category: "Electronics",
        completedAt: new Date("2024-02-01"),
        featured: true
      }
    ],
    availability: {
      isAvailable: true,
      availableForWork: true,
      availableForLearning: false,
      responseTime: "Usually responds within 4 hours"
    },
    pricing: {
      serviceRate: 3000,
      learningRate: 2000,
      currency: "NGN"
    },
    whatsappNumber: "08087654321",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  }
]