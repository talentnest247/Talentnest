// Mock d    providerCount: 9ta for development - replace with real database calls later
import type { User, Category, Review, Provider } from "./types"

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Fashion & Tailoring",
    description: "Custom clothing, alterations, and fashion design",
    icon: "👗",
    providerCount: 8
  },
  {
    id: "2",
    name: "Electronics & Technology",
    description: "Phone repairs, computer maintenance, and tech support",
    icon: "📱",
    providerCount: 5
  },
  {
    id: "3",
    name: "Beauty & Wellness",
    description: "Hair styling, makeup, and personal care services",
    icon: "💄",
    providerCount: 12
  },
  {
    id: "4",
    name: "Food & Catering",
    description: "Cooking, baking, and catering services",
    icon: "🍳",
    providerCount: 7
  },
  {
    id: "5",
    name: "Arts & Crafts",
    description: "Creative work, handmade items, and artistic services",
    icon: "🎨",
    providerCount: 4
  },
  {
    id: "6",
    name: "Construction & Repair",
    description: "Building, repairs, and maintenance services",
    icon: "🔨",
    providerCount: 6
  },
]

export const mockProviders: Provider[] = [
  {
    id: "1",
    email: "fatima.adebayo@example.com",
    password: "hashed_password",
    firstName: "Fatima",
    lastName: "Adebayo",
    fullName: "Fatima Adebayo",
    phone: "+234 803 123 4567",
    role: "artisan",
    businessName: "Fatima's Fashion House",
    description: "Professional fashion designer and tailor specializing in traditional and modern clothing. Expert in custom designs, alterations, and embroidery work.",
    specialization: ["Fashion Design", "Tailoring", "Embroidery"],
    experience: 8,
    location: "Ilorin, Kwara State",
    rating: 4.8,
    totalReviews: 127,
    verified: true,
    verificationStatus: "approved",
    verificationEvidence: ["/certificates/fashion-cert.pdf"],
    profileImage: "/professional-woman-tailor.png",
    portfolio: [
      {
        id: "1",
        providerId: "1",
        title: "Traditional Agbada Collection",
        description: "Custom-made traditional Agbada for special occasions",
        images: ["/traditional-agbada.png"],
        category: "Fashion & Style",
        completedAt: new Date("2024-01-15"),
        featured: true
      },
    ],
    availability: {
      isAvailable: true,
      availableForWork: true,
      availableForLearning: true,
      responseTime: "Usually responds within 2 hours"
    },
    pricing: {
      serviceRate: 15000,
      learningRate: 8000,
      currency: "NGN"
    },
    whatsappNumber: "+234 803 123 4567",
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    email: "ibrahim.tech@example.com",
    password: "hashed_password",
    firstName: "Ibrahim",
    lastName: "Suleiman",
    fullName: "Ibrahim Suleiman",
    phone: "+234 807 987 6543",
    role: "artisan",
    businessName: "TechFix Solutions",
    description: "Experienced technician specializing in phone repairs, computer maintenance, and software solutions. Quick and reliable service with warranty.",
    specialization: ["Phone Repair", "Computer Maintenance", "Software Installation"],
    experience: 5,
    location: "Ilorin, Kwara State",
    rating: 4.6,
    totalReviews: 89,
    verified: true,
    verificationStatus: "approved",
    verificationEvidence: ["/certificates/tech-cert.pdf"],
    profileImage: "/young-man-technician.png",
    portfolio: [],
    availability: {
      isAvailable: true,
      availableForWork: true,
      availableForLearning: false,
      responseTime: "Usually responds within 1 hour"
    },
    pricing: {
      serviceRate: 5000,
      learningRate: 3000,
      currency: "NGN"
    },
    whatsappNumber: "+234 807 987 6543",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-18"),
  },
]

// Mock database functions
export const mockDatabase = {
  users: [
    ...mockProviders,
    // Admin user for login
    {
      id: "admin-001",
      email: "talentnest247@gmail.com",
      fullName: "TalentNest Admin",
      firstName: "TalentNest",
      lastName: "Admin",
      role: "admin",
      password: "talentnest247", // In a real app, this would be hashed
      phone: "+234-123-456-7890",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ] as User[],
  categories: mockCategories,
  reviews: [] as Review[],

  // User operations
  async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  },

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    return this.categories
  },

  // Provider operations
  async getProviders(): Promise<Provider[]> {
    return this.users.filter((user) => user.role === "artisan") as Provider[]
  },

  async getProviderById(id: string): Promise<Provider | null> {
    const user = this.users.find((user) => user.id === id)
    return (user as Provider) || null
  },
}

// Additional mock API for auth operations
export const mockAPI = {
  async getUserByEmail(email: string): Promise<User | null> {
    return mockDatabase.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  },

  async getUserById(id: string): Promise<User | null> {
    return mockDatabase.users.find(user => user.id === id) || null
  },

  async createUser(userData: {
    email: string
    first_name: string
    last_name: string
    full_name: string
    phone: string
    role: "student" | "artisan" | "admin"
    student_id?: string
    department?: string
    level?: number
    password: string
  }): Promise<User> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      firstName: userData.first_name,
      lastName: userData.last_name,
      fullName: userData.full_name,
      phone: userData.phone,
      role: userData.role,
      studentId: userData.student_id,
      department: userData.department,
      level: userData.level?.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockDatabase.users.push(newUser)
    return newUser
  }
}
