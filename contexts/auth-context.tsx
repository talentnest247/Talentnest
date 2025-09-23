"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthUser } from "@/lib/auth-utils"

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
    role: "student" | "provider" | "admin"
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
    // Additional fields for service providers
    businessName?: string
    specialization?: string
    experience?: number
    location?: string
    certificates?: string[]
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
        // Call server-side endpoint which reads the httpOnly auth cookie and
        // returns the full user if the session is valid. This avoids trying to
        // read httpOnly cookies from document.cookie (not accessible from JS).
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const body = await res.json()
          if (body && body.user) {
            setUser(body.user)
          }
        } else {
          // No valid session found; ensure user is null
          setUser(null)
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
      // Fetch full user from server (reads httpOnly cookie) to ensure we have
      // complete profile data and role information.
      try {
        const me = await fetch('/api/auth/me')
        if (me.ok) {
          const body = await me.json()
          if (body.user) setUser(body.user)
        } else {
          // fallback to using the returned user (if any)
          if (data.user) setUser(data.user)
        }
      } catch {
        if (data.user) setUser(data.user)
      }
      
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
    role: "student" | "provider" | "admin"
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
    // Additional fields for service providers
    businessName?: string
    specialization?: string
    experience?: number
    location?: string
    certificates?: string[]
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
        // After register, server sets the httpOnly cookie. Fetch /api/auth/me
        // to obtain the canonical user object with role and profile fields.
        try {
          const me = await fetch('/api/auth/me')
          if (me.ok) {
            const body = await me.json()
            if (body.user) setUser(body.user)
            else setUser(data.user)
          } else {
            setUser(data.user)
          }
        } catch {
          setUser(data.user)
        }
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
