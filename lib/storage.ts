// Local storage utilities for development (will be replaced with real database)

import type { User, Service, Booking, Category } from "./types"

// Storage keys
const STORAGE_KEYS = {
  USERS: "talentnest_users",
  SERVICES: "talentnest_services",
  BOOKINGS: "talentnest_bookings",
  REVIEWS: "talentnest_reviews",
  CATEGORIES: "talentnest_categories",
  CURRENT_USER: "talentnest_current_user",
}

// Utility functions
export const generateId = () => Math.random().toString(36).substr(2, 9)

export const getCurrentTimestamp = () => new Date().toISOString()

// Generic storage functions
const getFromStorage = (key: string): unknown[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

const saveToStorage = (key: string, data: unknown[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// User storage functions
export const getUsers = (): User[] => getFromStorage(STORAGE_KEYS.USERS) as User[]

export const saveUser = (user: User) => {
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = { ...user, updatedAt: getCurrentTimestamp() }
  } else {
    users.push(user)
  }

  saveToStorage(STORAGE_KEYS.USERS, users)
}

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers()
  return users.find((u) => u.email === email) || null
}

export const getUserByMatricNumber = (matricNumber: string): User | null => {
  const users = getUsers()
  return users.find((u) => u.matricNumber === matricNumber) || null
}

// Current user session
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return userData ? JSON.parse(userData) : null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Service storage functions
export const getServices = (): Service[] => getFromStorage(STORAGE_KEYS.SERVICES) as Service[]

export const saveService = (service: Service) => {
  const services = getServices()
  const existingIndex = services.findIndex((s) => s.id === service.id)

  if (existingIndex >= 0) {
    services[existingIndex] = { ...service, updatedAt: getCurrentTimestamp() }
  } else {
    services.push(service)
  }

  saveToStorage(STORAGE_KEYS.SERVICES, services)
}

export const deleteService = (serviceId: string) => {
  const services = getServices()
  const filteredServices = services.filter(s => s.id !== serviceId)
  saveToStorage(STORAGE_KEYS.SERVICES, filteredServices)
}

export const getServicesByUserId = (userId: string): Service[] => {
  const services = getServices()
  return services.filter((s) => s.userId === userId && s.isActive)
}

export const getServicesByCategory = (category: string): Service[] => {
  const services = getServices()
  return services.filter((s) => s.category === category && s.isActive)
}

// Booking storage functions
export const getBookings = (): Booking[] => getFromStorage(STORAGE_KEYS.BOOKINGS) as Booking[]

export const saveBooking = (booking: Booking) => {
  const bookings = getBookings()
  const existingIndex = bookings.findIndex((b) => b.id === booking.id)

  if (existingIndex >= 0) {
    bookings[existingIndex] = { ...booking, updatedAt: getCurrentTimestamp() }
  } else {
    bookings.push(booking)
  }

  saveToStorage(STORAGE_KEYS.BOOKINGS, bookings)
}

// Admin management functions
// Admin functions for user management
export const updateUserStatus = (userId: string, status: "verified" | "pending" | "suspended"): boolean => {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) return false

  users[userIndex] = {
    ...users[userIndex],
    status,
    updatedAt: getCurrentTimestamp(),
  }

  saveToStorage(STORAGE_KEYS.USERS, users)
  return true
}

// Admin functions for service management
export const updateServiceStatus = (
  serviceId: string,
  status: "active" | "pending" | "rejected" | "flagged",
): boolean => {
  const services = getServices()
  const serviceIndex = services.findIndex((s) => s.id === serviceId)

  if (serviceIndex === -1) return false

  services[serviceIndex] = {
    ...services[serviceIndex],
    status,
    isActive: status === "active",
    updatedAt: getCurrentTimestamp(),
  }

  saveToStorage(STORAGE_KEYS.SERVICES, services)
  return true
}

// Admin functions for booking management
export const getBookingsByUserId = (userId: string): Booking[] => {
  const bookings = getBookings()
  return bookings.filter((b) => b.clientId === userId || b.providerId === userId)
}

export const updateBookingStatus = (
  bookingId: string,
  status: "pending" | "accepted" | "completed" | "cancelled",
): boolean => {
  const bookings = getBookings()
  const bookingIndex = bookings.findIndex((b) => b.id === bookingId)

  if (bookingIndex === -1) return false

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    status,
    updatedAt: getCurrentTimestamp(),
  }

  saveToStorage(STORAGE_KEYS.BOOKINGS, bookings)
  return true
}

// Admin analytics functions
export const getAdminStats = () => {
  const users = getUsers()
  const services = getServices()
  const bookings = getBookings()

  return {
    totalUsers: users.length,
    verifiedUsers: users.filter((u) => u.status === "verified").length,
    pendingUsers: users.filter((u) => u.status === "pending").length,
    totalServices: services.length,
    activeServices: services.filter((s) => s.isActive).length,
    pendingServices: services.filter((s) => s.status === "pending").length,
    totalBookings: bookings.length,
    completedBookings: bookings.filter((b) => b.status === "completed").length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
  }
}

// Initialize default data
export const initializeDefaultData = () => {
  // Initialize categories if not exists
  const categories = getFromStorage(STORAGE_KEYS.CATEGORIES)
  if (categories.length === 0) {
    const defaultCategories: Category[] = [
      {
        id: generateId(),
        name: "digital",
        description: "Web development, graphic design, content creation",
        icon: "Search",
        isActive: true,
      },
      {
        id: generateId(),
        name: "artisan",
        description: "Handmade items, tailoring, jewelry making",
        icon: "Users",
        isActive: true,
      },
      {
        id: generateId(),
        name: "tutoring",
        description: "Peer-to-peer learning, workshops, mentoring",
        icon: "BookOpen",
        isActive: true,
      },
    ]
    saveToStorage(STORAGE_KEYS.CATEGORIES, defaultCategories)
  }
}
