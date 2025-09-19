// Mock data for development - replace with real database calls later
import type { User, Artisan, Skill, Category, Review, Enrollment } from "./types"

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Fashion & Tailoring",
    description: "Learn clothing design, tailoring, and fashion creation",
    icon: "👗",
    skillCount: 12,
    providerCount: 8,
    skills: ["Dress Making", "Alterations", "Pattern Design"]
  },
  {
    id: "2",
    name: "Technology & Repairs",
    description: "Phone repairs, computer maintenance, and tech skills",
    icon: "📱",
    skillCount: 8,
    providerCount: 5,
    skills: ["Phone Repair", "Computer Maintenance", "Software Installation"]
  },
  {
    id: "3",
    name: "Beauty & Wellness",
    description: "Hair styling, makeup, skincare, and wellness services",
    icon: "💄",
    skillCount: 15,
    providerCount: 12,
    skills: ["Hair Styling", "Makeup Artistry", "Skincare"]
  },
  {
    id: "4",
    name: "Food & Catering",
    description: "Cooking, baking, catering, and food business",
    icon: "🍳",
    skillCount: 10,
    providerCount: 7,
    skills: ["Baking", "Catering", "Nigerian Cuisine"]
  },
  {
    id: "5",
    name: "Arts & Crafts",
    description: "Painting, sculpture, crafts, and creative arts",
    icon: "🎨",
    skillCount: 7,
    providerCount: 4,
    skills: ["Portrait Painting", "Crafts", "Digital Art"]
  },
  {
    id: "6",
    name: "Construction & Trades",
    description: "Carpentry, plumbing, electrical work, and building trades",
    icon: "🔨",
    skillCount: 9,
    providerCount: 6,
    skills: ["Carpentry", "Plumbing", "Electrical Work"]
  },
]

export const mockArtisans: Artisan[] = [
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
        title: "Traditional Agbada Collection",
        description: "Custom-made traditional Agbada for special occasions",
        images: ["/traditional-agbada.png"],
        completedAt: new Date("2024-01-15"),
      },
    ],
    skills: [],
    availability: {
      isAvailable: true,
      availableForWork: true,
      availableForLearning: true,
      responseTime: "Usually responds within 2 hours"
    },
    pricing: {
      baseRate: 15000,
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
    skills: [],
    availability: {
      isAvailable: true,
      availableForWork: true,
      availableForLearning: false,
      responseTime: "Usually responds within 1 hour"
    },
    pricing: {
      baseRate: 5000,
      learningRate: 3000,
      currency: "NGN"
    },
    whatsappNumber: "+234 807 987 6543",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-18"),
  },
]

export const mockSkills: Skill[] = [
  {
    id: "1",
    artisanId: "1",
    title: "Complete Fashion Design Masterclass",
    description: "Learn fashion design from basics to advanced techniques. Create your own clothing line.",
    category: "Fashion & Tailoring",
    difficulty: "intermediate",
    duration: "8 weeks",
    price: 25000,
    maxStudents: 15,
    currentStudents: 8,
    images: ["/fashion-design-class.png"],
    syllabus: [
      "Introduction to Fashion Design",
      "Pattern Making Basics",
      "Fabric Selection and Care",
      "Sewing Techniques",
      "Design Development",
      "Portfolio Creation",
    ],
    requirements: ["Basic sewing knowledge helpful but not required", "Notebook and pen", "Measuring tape"],
    instructor: {
      id: "1",
      name: "Fatima Adebayo",
      image: "/professional-woman-tailor.png",
      rating: 4.8,
      businessName: "Fatima's Fashion House"
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    artisanId: "2",
    title: "Smartphone Repair Fundamentals",
    description: "Master the art of smartphone repair and start your own repair business.",
    category: "Technology & Repairs",
    difficulty: "beginner",
    duration: "4 weeks",
    price: 15000,
    maxStudents: 10,
    currentStudents: 6,
    images: ["/placeholder-pzimb.png"],
    syllabus: [
      "Phone Components Overview",
      "Common Issues and Diagnosis",
      "Screen Replacement",
      "Battery Replacement",
      "Software Troubleshooting",
      "Business Setup Tips",
    ],
    requirements: ["No prior experience needed", "Basic tools will be provided during class"],
    instructor: {
      id: "2",
      name: "Ibrahim Suleiman",
      image: "/young-man-technician.png",
      rating: 4.6,
      businessName: "TechFix Solutions"
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-20"),
  },
]

// Mock database functions
export const mockDatabase = {
  users: [...mockArtisans] as User[],
  skills: mockSkills,
  categories: mockCategories,
  enrollments: [] as Enrollment[],
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

  // Skill operations
  async getSkills(): Promise<Skill[]> {
    return this.skills
  },

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return this.skills.filter((skill) => skill.category === category)
  },

  async getSkillById(id: string): Promise<Skill | null> {
    return this.skills.find((skill) => skill.id === id) || null
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    return this.categories
  },

  // Artisan operations
  async getArtisans(): Promise<Artisan[]> {
    return this.users.filter((user) => user.role === "artisan") as Artisan[]
  },

  async getArtisanById(id: string): Promise<Artisan | null> {
    const user = this.users.find((user) => user.id === id && user.role === "artisan")
    return (user as Artisan) || null
  },
}
