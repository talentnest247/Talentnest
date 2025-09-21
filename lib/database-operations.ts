import { supabase } from './supabase'
import { mockCategories, mockArtisans } from './mock-data'
import type { Artisan, Category, Skill } from './types'

// Database response types - temporarily commented out during transition
/*
interface ArtisanDbResponse {
  id: string
  business_name?: string
  bio?: string
  years_experience?: number
  specialization?: string
  location?: string
  hourly_rate?: number
  rating?: number
  total_reviews?: number
  total_students?: number
  verification_status: string
  portfolio_images?: string[]
  certificates?: string[]
  available_days?: string[]
  available_hours?: string
  is_available?: boolean
  profiles?: {
    id: string
    full_name?: string
    first_name?: string
    last_name?: string
    email?: string
    avatar_url?: string
    phone?: string
  }
  artisan_skills?: Array<{
    skill_id: string
    proficiency_level: string
    price_per_hour?: number
    skills?: {
      id: string
      name: string
      description?: string
      category_id: string
      difficulty_level?: string
      categories?: {
        name: string
        slug: string
      }
    }
  }>
}

interface CategoryDbResponse {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
}

interface SkillDbResponse {
  id: string
  name: string
  description?: string
  category_id: string
  price_range_min?: number
  price_range_max?: number
  duration_hours?: number
  difficulty_level?: string
  is_active: boolean
  categories?: {
    name: string
    slug: string
    color?: string
  }
}
*/

// Re-export types from the main types file
export type { Artisan, Category, Skill } from './types'

// Database connection check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Test Supabase connection by querying a simple table
    const { error } = await supabase.from('categories').select('count', { count: 'exact', head: true })
    if (error) {
      console.warn('Supabase connection failed, using mock data:', error.message)
      return false
    }
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Provider operations
export async function getAllProviders(): Promise<Artisan[]> {
  try {
    // First check if database is available
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      console.log('Using mock data for providers')
      return mockArtisans
    }

    // For now, return mock data while we transition to the new database schema
    // TODO: Implement proper database queries once schema is deployed
    console.log('Database connected, but using mock data during transition')
    return mockArtisans
  } catch (error) {
    console.error('Error fetching providers:', error)
    // Fallback to mock data
    return mockArtisans
  }
}

// Category operations
export async function getAllCategories(): Promise<Category[]> {
  try {
    // First check if database is available
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      console.log('Using mock data for categories')
      return mockCategories
    }

    // For now, return mock data while we transition to the new database schema
    // TODO: Implement proper database queries once schema is deployed
    console.log('Database connected, but using mock data during transition')
    return mockCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return mockCategories
  }
}

// Skills operations
export async function getAllSkills(): Promise<Skill[]> {
  try {
    // First check if database is available
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      console.log('Using mock data for skills')
      // Extract all skills from all artisans
      const allSkills: Skill[] = []
      for (const artisan of mockArtisans) {
        allSkills.push(...artisan.skills)
      }
      return allSkills
    }

    // For now, return mock data while we transition to the new database schema
    // TODO: Implement proper database queries once schema is deployed
    console.log('Database connected, but using mock data during transition')
    const allSkills: Skill[] = []
    for (const artisan of mockArtisans) {
      allSkills.push(...artisan.skills)
    }
    return allSkills
  } catch (error) {
    console.error('Error fetching skills:', error)
    // Fallback to mock data
    const allSkills: Skill[] = []
    for (const artisan of mockArtisans) {
      allSkills.push(...artisan.skills)
    }
    return allSkills
  }
}

// Search providers
export async function searchProviders(query: string): Promise<Artisan[]> {
  try {
    const allProviders = await getAllProviders()
    
    if (!query || query.trim() === '') {
      return allProviders
    }
    
    const searchTerm = query.toLowerCase().trim()
    
    const filteredProviders = allProviders.filter(provider => 
      provider.fullName?.toLowerCase().includes(searchTerm) ||
      provider.firstName?.toLowerCase().includes(searchTerm) ||
      provider.lastName?.toLowerCase().includes(searchTerm) ||
      provider.businessName?.toLowerCase().includes(searchTerm) ||
      provider.specialization?.some((spec: string) => spec.toLowerCase().includes(searchTerm)) ||
      provider.description?.toLowerCase().includes(searchTerm) ||
      provider.bio?.toLowerCase().includes(searchTerm) ||
      provider.skills?.some((skill: Skill) => skill.title?.toLowerCase().includes(searchTerm))
    )
    
    return filteredProviders
  } catch (error) {
    console.error('Error searching providers:', error)
    return []
  }
}

// Additional helper functions for completeness
export async function getProviderById(id: string): Promise<Artisan | null> {
  try {
    const providers = await getAllProviders()
    return providers.find(provider => provider.id === id) || null
  } catch (error) {
    console.error('Error fetching provider by ID:', error)
    throw new Error('Failed to fetch provider')
  }
}

export async function getSkillById(id: string): Promise<Skill | null> {
  try {
    const skills = await getAllSkills()
    return skills.find(skill => skill.id === id) || null
  } catch (error) {
    console.error('Error fetching skill by ID:', error)
    throw new Error('Failed to fetch skill')
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const categories = await getAllCategories()
    return categories.find(category => category.id === id) || null
  } catch (error) {
    console.error('Error fetching category by ID:', error)
    throw new Error('Failed to fetch category')
  }
}
