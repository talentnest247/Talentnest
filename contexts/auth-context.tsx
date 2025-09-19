"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authUtils, type AuthUser } from "@/lib/auth-utils"

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: "student" | "artisan"
    studentId?: string
    department?: string
    level?: string
  bio?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  stateOfOrigin?: string
  emergencyContact?: string
  emergencyPhone?: string
  }) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-token="))
          ?.split("=")[1]

        if (token) {
          // Verify JWT token
          const verifiedUser = await authUtils.verifyToken(token)
          if (verifiedUser) {
            // If token doesn't have complete data, fetch from database
            if (!verifiedUser.firstName || !verifiedUser.department) {
              const fullUser = await authUtils.getUserById(verifiedUser.id)
              if (fullUser) {
                setUser(fullUser)
              } else {
                setUser(verifiedUser)
              }
            } else {
              setUser(verifiedUser)
            }
          } else {
            // Clear invalid token
            document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

    const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
  const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Login failed:", data.error || "Unknown error")
        return false
      }

      console.log("Login successful:", data)
      setUser(data.user)
      
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: "student" | "artisan"
    studentId?: string
    department?: string
    level?: string
    bio?: string
    address?: string
    dateOfBirth?: string
    gender?: string
    nationality?: string
    stateOfOrigin?: string
    emergencyContact?: string
    emergencyPhone?: string
  }): Promise<boolean> => {
    setIsLoading(true)
    try {
  const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        console.log("Registration successful:", data)
        setUser(data.user)
        return true
      }
      console.error("Registration failed:", data.error || "Unknown error")
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }

    // Clear cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    setUser(null)
    
    // Redirect to login page
    window.location.href = "/login"
  }

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
