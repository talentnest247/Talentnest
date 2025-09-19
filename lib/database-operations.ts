import { mockCategories, mockArtisans } from './mock-data'
import type { Artisan, Category, Skill } from './types'

// Re-export types from the main types file
export type { Artisan, Category, Skill } from './types'

// Database connection check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Simulate database connection check
    await new Promise(resolve => setTimeout(resolve, 100))
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Provider operations
export async function getAllProviders(): Promise<Artisan[]> {
  try {
    // Return mock artisan data that matches the Artisan interface
    return mockArtisans
  } catch (error) {
    console.error('Error fetching providers:', error)
    throw new Error('Failed to fetch providers')
  }
}
// Category operations
export async function getAllCategories(): Promise<Category[]> {
  try {
    return mockCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

// Skills operations
export async function getAllSkills(): Promise<Skill[]> {
  try {
    // Extract all skills from all artisans
    const allSkills: Skill[] = []
    for (const artisan of mockArtisans) {
      allSkills.push(...artisan.skills)
    }
    return allSkills
  } catch (error) {
    console.error('Error fetching skills:', error)
    throw new Error('Failed to fetch skills')
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
      provider.firstName.toLowerCase().includes(searchTerm) ||
      provider.lastName.toLowerCase().includes(searchTerm) ||
      provider.businessName.toLowerCase().includes(searchTerm) ||
      provider.specialization.some(spec => spec.toLowerCase().includes(searchTerm)) ||
      (provider.description && provider.description.toLowerCase().includes(searchTerm))
    )
    
    return filteredProviders
  } catch (error) {
    console.error('Error searching providers:', error)
    throw new Error('Failed to search providers')
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
