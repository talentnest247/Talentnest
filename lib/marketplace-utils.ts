import { supabase } from './supabase'
import { 
  EnhancedProfile, 
  Service, 
  ServiceBooking, 
  SearchFilters, 
  SearchResults,
  ApiResponse,
  Review,
  Wallet,
  Transaction,
  Notification
} from './marketplace-types'

// Service Management
export class ServiceManager {
  static async createService(serviceData: Partial<Service>): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select(`
          *,
          provider:profiles(*),
          category:service_categories(*)
        `)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async updateService(serviceId: string, updates: Partial<Service>): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', serviceId)
        .select(`
          *,
          provider:profiles(*),
          category:service_categories(*)
        `)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async deleteService(serviceId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async getProviderServices(providerId: string): Promise<ApiResponse<Service[]>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          category:service_categories(*),
          reviews(rating)
        `)
        .eq('provider_id', providerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

// Search and Discovery
export class SearchManager {
  static async searchServices(filters: SearchFilters): Promise<ApiResponse<SearchResults>> {
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          provider:profiles(
            id, full_name, avatar_url, rating_average, total_reviews, 
            verification_status, availability_status, location_on_campus
          ),
          category:service_categories(*),
          reviews!inner(rating)
        `, { count: 'exact' })
        .eq('is_active', true)

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,tags.cs.{${filters.query}}`)
      }

      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id)
      }

      if (filters.price_min) {
        query = query.gte('base_price', filters.price_min)
      }

      if (filters.price_max) {
        query = query.lte('base_price', filters.price_max)
      }

      if (filters.delivery_time_max) {
        query = query.lte('delivery_time', filters.delivery_time_max)
      }

      if (filters.verification_status === 'verified') {
        query = query.eq('provider.verification_status', 'verified')
      }

      if (filters.availability === 'online') {
        query = query.eq('provider.availability_status', 'online')
      }

      if (filters.location) {
        query = query.ilike('provider.location_on_campus', `%${filters.location}%`)
      }

      if (filters.rating_min) {
        query = query.gte('provider.rating_average', filters.rating_min)
      }

      // Apply sorting
      switch (filters.sort_by) {
        case 'rating':
          query = query.order('provider.rating_average', { ascending: false })
          break
        case 'price_low':
          query = query.order('base_price', { ascending: true })
          break
        case 'price_high':
          query = query.order('base_price', { ascending: false })
          break
        case 'popular':
          query = query.order('provider.total_bookings', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      // Pagination
      const page = filters.page || 1
      const limit = filters.limit || 12
      const offset = (page - 1) * limit

      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      const totalPages = Math.ceil((count || 0) / limit)

      return {
        success: true,
        data: {
          services: data || [],
          providers: [], // Will be populated separately if needed
          total_count: count || 0,
          page,
          limit,
          total_pages: totalPages
        }
      }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async getTopProviders(limit: number = 10): Promise<ApiResponse<EnhancedProfile[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          services!inner(id),
          reviews!reviewee_id(rating)
        `)
        .eq('role', 'artisan')
        .eq('verification_status', 'verified')
        .order('rating_average', { ascending: false })
        .order('total_bookings', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async getServicesByCategory(categoryId: string, limit: number = 8): Promise<ApiResponse<Service[]>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:profiles(
            id, full_name, avatar_url, rating_average, 
            verification_status, availability_status
          ),
          category:service_categories(*)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('provider.rating_average', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

// Booking Management
export class BookingManager {
  static async createBooking(bookingData: Partial<ServiceBooking>): Promise<ApiResponse<ServiceBooking>> {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .insert([bookingData])
        .select(`
          *,
          service:services(*),
          seeker:profiles(*),
          provider:profiles(*)
        `)
        .single()

      if (error) throw error

      // Create notification for provider
      await NotificationManager.createNotification({
        user_id: data.provider_id,
        type: 'booking',
        title: 'New Service Request',
        content: `You have a new booking request for "${data.title}"`,
        action_url: `/dashboard/bookings/${data.id}`
      })

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async updateBookingStatus(
    bookingId: string, 
    status: ServiceBooking['status'],
    userId: string
  ): Promise<ApiResponse<ServiceBooking>> {
    try {
      const updates: Partial<ServiceBooking> = { status }

      if (status === 'accepted') {
        updates.accepted_at = new Date().toISOString()
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('service_bookings')
        .update(updates)
        .eq('id', bookingId)
        .select(`
          *,
          service:services(*),
          seeker:profiles(*),
          provider:profiles(*)
        `)
        .single()

      if (error) throw error

      // Create notification for the other party
      const notificationUserId = data.provider_id === userId ? data.seeker_id : data.provider_id
      const notificationContent = {
        pending: `You have a new booking request for "${data.title}"`,
        accepted: `Your booking request for "${data.title}" has been accepted`,
        in_progress: `Work has started on "${data.title}"`,
        completed: `"${data.title}" has been marked as completed`,
        cancelled: `The booking for "${data.title}" has been cancelled`,
        disputed: `There is a dispute regarding "${data.title}"`
      }

      await NotificationManager.createNotification({
        user_id: notificationUserId,
        type: 'booking',
        title: 'Booking Update',
        content: notificationContent[status] || `Booking status updated to ${status}`,
        action_url: `/dashboard/bookings/${data.id}`
      })

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async getUserBookings(
    userId: string, 
    role: 'seeker' | 'provider'
  ): Promise<ApiResponse<ServiceBooking[]>> {
    try {
      const column = role === 'seeker' ? 'seeker_id' : 'provider_id'
      
      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          service:services(*),
          seeker:profiles(*),
          provider:profiles(*)
        `)
        .eq(column, userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

// Review Management
export class ReviewManager {
  static async createReview(reviewData: Partial<Review>): Promise<ApiResponse<Review>> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select(`
          *,
          reviewer:profiles(*),
          reviewee:profiles(*),
          booking:service_bookings(*)
        `)
        .single()

      if (error) throw error

      // Update provider's rating average
      await this.updateProviderRating(data.reviewee_id)

      // Create notification for reviewee
      await NotificationManager.createNotification({
        user_id: data.reviewee_id,
        type: 'review',
        title: 'New Review Received',
        content: `You received a ${data.rating}-star review`,
        action_url: `/profile/${data.reviewee_id}#reviews`
      })

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async updateProviderRating(providerId: string): Promise<void> {
    try {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', providerId)

      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const avgRating = totalRating / reviews.length

        await supabase
          .from('profiles')
          .update({
            rating_average: Number(avgRating.toFixed(2)),
            total_reviews: reviews.length
          })
          .eq('id', providerId)
      }
    } catch (error) {
      console.error('Error updating provider rating:', error)
    }
  }

  static async getProviderReviews(providerId: string): Promise<ApiResponse<Review[]>> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles(id, full_name, avatar_url),
          booking:service_bookings(title)
        `)
        .eq('reviewee_id', providerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

// Wallet Management
export class WalletManager {
  static async getOrCreateWallet(userId: string): Promise<ApiResponse<Wallet>> {
    try {
      const { data: wallet, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Wallet doesn't exist, create it
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert([{ user_id: userId }])
          .select('*')
          .single()

        if (createError) throw createError
        return { success: true, data: newWallet }
      } else if (error) {
        throw error
      }

      return { success: true, data: wallet }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async addTransaction(
    walletId: string,
    transactionData: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ wallet_id: walletId, ...transactionData }])
        .select('*')
        .single()

      if (error) throw error

      // Update wallet balance based on transaction type
      await this.updateWalletBalance(walletId)

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async updateWalletBalance(walletId: string): Promise<void> {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('transaction_type, amount, fee, status')
        .eq('wallet_id', walletId)
        .eq('status', 'completed')

      if (transactions) {
        let balance = 0
        let totalEarned = 0
        let totalSpent = 0

        transactions.forEach(tx => {
          const netAmount = tx.amount - tx.fee
          
          switch (tx.transaction_type) {
            case 'topup':
            case 'refund':
              balance += netAmount
              break
            case 'release':
              totalEarned += netAmount
              balance += netAmount
              break
            case 'escrow':
              totalSpent += tx.amount
              balance -= tx.amount
              break
          }
        })

        await supabase
          .from('wallets')
          .update({ balance, total_earned: totalEarned, total_spent: totalSpent })
          .eq('id', walletId)
      }
    } catch (error) {
      console.error('Error updating wallet balance:', error)
    }
  }
}

// Notification Management
export class NotificationManager {
  static async createNotification(notificationData: Partial<Notification>): Promise<ApiResponse<Notification>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select('*')
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async getUserNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  static async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

// Utility Functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

export const formatTimeAgo = (date: string): string => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export const generateReference = (): string => {
  return `TN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }

  return { valid: true }
}