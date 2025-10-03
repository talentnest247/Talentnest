import { supabase } from './supabase'
import { mockCategories, mockProviders } from './mock-data'
import type { Provider, Category } from './types'

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
  artisan_services?: Array<{
    service_id: string
    proficiency_level: string
    price_per_hour?: number
    services?: {
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

interface ServiceDbResponse {
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
export type { Provider, Category } from './types'

// Database connection check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Test Supabase connection with a timeout to prevent long waits
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 3000) // 3 second timeout
    })
    
    const connectionTest = supabase.from('categories').select('count', { count: 'exact', head: true })
    
    const { error } = await Promise.race([connectionTest, timeoutPromise])
    
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
export async function getAllProviders(): Promise<Provider[]> {
  try {
    // Try to fetch real data from Supabase first
    const { data: providers, error } = await supabase
      .from('verified_artisans')
      .select('*')

    if (!error && providers && providers.length > 0) {
      // Transform Supabase data to match Provider interface
      const transformedProviders: Provider[] = providers.map(artisan => ({
        // User fields
        id: artisan.id,
        email: artisan.email || '',
        password: '', // Never expose password
        firstName: artisan.first_name || 'Unknown',
        lastName: artisan.last_name || 'User',
        fullName: artisan.full_name || 'Unknown Artisan',
        phone: artisan.phone || '',
        role: 'artisan' as const,
        profileImage: artisan.profile_image || '/placeholder.svg',
        createdAt: new Date(artisan.created_at),
        updatedAt: new Date(artisan.updated_at),
        
        // Provider-specific fields
        businessName: artisan.business_name || artisan.full_name || 'Unknown Business',
        description: artisan.bio || 'Professional service provider',
        bio: artisan.bio || 'Professional service provider',
        specialization: artisan.specializations ? artisan.specializations.split(',') : ['General Service'],
        experience: artisan.experience_years || 0,
        location: artisan.location || 'UNILORIN',
        rating: artisan.average_rating || 0,
        totalReviews: artisan.total_reviews || 0,
        verified: artisan.verification_status === 'verified',
        verificationStatus: artisan.verification_status || 'pending',
        verificationEvidence: artisan.verification_evidence ? artisan.verification_evidence.split(',') : [],
        certificates: artisan.certificates ? artisan.certificates.split(',') : [],
        portfolio: [], // Will be fetched separately if needed
        availability: {
          isAvailable: artisan.is_available || true,
          availableForWork: artisan.available_for_work || true,
          availableForLearning: artisan.available_for_learning || false,
          responseTime: artisan.response_time || 'Usually responds within 24 hours'
        },
        pricing: {
          serviceRate: artisan.service_rate || undefined,
          learningRate: artisan.learning_rate || undefined,
          currency: 'NGN'
        },
        whatsappNumber: artisan.whatsapp || artisan.phone || ''
      }))
      
      console.log(`Fetched ${transformedProviders.length} real providers from database`)
      return transformedProviders
    }

    // Fallback to mock data if no real data available
    console.log('No real providers found, using mock data')
    return mockProviders
  } catch (error) {
    console.error('Error fetching providers:', error)
    // Fallback to mock data
    console.log('Database error, using mock data as fallback')
    return mockProviders
  }
}

// Category operations
export async function getAllCategories(): Promise<Category[]> {
  try {
    // Try to fetch real data from Supabase first
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')

    if (!error && categories && categories.length > 0) {
      // Transform Supabase data to match Category interface
      const transformedCategories: Category[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || '',
        icon: category.icon || '🔧',
        providerCount: category.provider_count || 0
      }))
      
      console.log(`Fetched ${transformedCategories.length} real categories from database`)
      return transformedCategories
    }

    // Fallback to mock data if no real data available
    console.log('No real categories found, using mock data')
    return mockCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
    console.log('Database error, using mock data as fallback')
    return mockCategories
  }
}

// Search providers based on query, category, location, etc.
export async function searchProviders(query: string): Promise<Provider[]> {
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
      provider.portfolio?.some((item) => item.title?.toLowerCase().includes(searchTerm) || item.description?.toLowerCase().includes(searchTerm))
    )
    
    return filteredProviders
  } catch (error) {
    console.error('Error searching providers:', error)
    return []
  }
}

// Additional helper functions for completeness
export async function getProviderById(id: string): Promise<Provider | null> {
  try {
    const providers = await getAllProviders()
    return providers.find(provider => provider.id === id) || null
  } catch (error) {
    console.error('Error fetching provider by ID:', error)
    throw new Error('Failed to fetch provider')
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
