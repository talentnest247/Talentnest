// Mock database system to replace Neon dependency
export interface MockUser {
  id: string
  email: string
  full_name: string
  user_type: "student" | "artisan"
  password: string
  created_at: string
}

export interface MockArtisanProfile {
  id: string
  user_id: string
  business_name: string
  description: string
  location: string
  phone: string
  skills: string[]
  experience_years: number
  is_verified: boolean
  rating: number
  total_reviews: number
}

export interface MockSkill {
  id: string
  name: string
  description: string
  category: string
  difficulty_level: string
  duration_weeks: number
  price: number
}

// In-memory storage
const users: MockUser[] = []
const artisanProfiles: MockArtisanProfile[] = []
const skills: MockSkill[] = [
  {
    id: "1",
    name: "Traditional Tailoring",
    description: "Learn traditional Nigerian tailoring techniques",
    category: "Fashion",
    difficulty_level: "Intermediate",
    duration_weeks: 8,
    price: 25000,
  },
  {
    id: "2",
    name: "Shoe Making",
    description: "Craft quality leather shoes from scratch",
    category: "Fashion",
    difficulty_level: "Advanced",
    duration_weeks: 12,
    price: 35000,
  },
  {
    id: "3",
    name: "Electronics Repair",
    description: "Fix phones, laptops and electronic devices",
    category: "Technology",
    difficulty_level: "Intermediate",
    duration_weeks: 6,
    price: 20000,
  },
]

// Mock SQL template function
export function mockSql(strings: TemplateStringsArray, ...values: any[]) {
  const query = strings.join("?").toLowerCase()

  if (query.includes("insert into users")) {
    const [email, fullName, password, userType] = values
    const newUser: MockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      full_name: fullName,
      user_type: userType,
      password,
      created_at: new Date().toISOString(),
    }
    users.push(newUser)
    return [newUser]
  }

  if (query.includes("insert into artisan_profiles")) {
    const [userId, businessName, description, location, phone, skills, experienceYears, isVerified] = values
    const newProfile: MockArtisanProfile = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      business_name: businessName,
      description,
      location,
      phone,
      skills,
      experience_years: experienceYears,
      is_verified: isVerified,
      rating: 0,
      total_reviews: 0,
    }
    artisanProfiles.push(newProfile)
    return [newProfile]
  }

  if (query.includes("select") && query.includes("from users") && query.includes("where email")) {
    const [email] = values
    return users.filter((user) => user.email === email)
  }

  if (query.includes("select") && query.includes("from users") && query.includes("where id")) {
    const [id] = values
    return users.filter((user) => user.id === id)
  }

  return []
}
