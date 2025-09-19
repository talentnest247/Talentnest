// Authentication utilities
import type { User } from "./types"
import { mockDatabase } from "./mock-data"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const authUtils = {
  async login(email: string, password: string): Promise<User | null> {
    // In a real app, this would hash the password and check against database
    const user = await mockDatabase.getUserByEmail(email)
    if (user && user.password === password) {
      return user
    }
    return null
  },

  async register(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    // In a real app, this would hash the password
    return await mockDatabase.createUser(userData)
  },

  async getCurrentUser(): Promise<User | null> {
    // In a real app, this would check JWT token or session
    const userId = localStorage.getItem("userId")
    if (userId) {
      return await mockDatabase.getUserById(userId)
    }
    return null
  },

  logout(): void {
    localStorage.removeItem("userId")
  },
}
