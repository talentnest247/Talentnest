"use client"
import { useAuth } from "@/contexts/auth-context"
import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  allowedRoles?: ("student" | "artisan" | "admin")[]
}

export function AuthGuard({ children, requireAuth = true, redirectTo = "/login", allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirectedRef.current || isLoading) {
      return
    }

    if (requireAuth && !isAuthenticated) {
      hasRedirectedRef.current = true
      router.push(redirectTo)
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      hasRedirectedRef.current = true
      router.push("/unauthorized")
      return
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, allowedRoles, user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
