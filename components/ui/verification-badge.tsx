"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Award, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerificationBadgeProps {
  verified: boolean
  variant?: "default" | "compact" | "detailed"
  className?: string
}

export function VerificationBadge({ 
  verified, 
  variant = "default", 
  className 
}: VerificationBadgeProps) {
  if (!verified) {
    return null
  }

  if (variant === "compact") {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-green-100 text-green-700 border-green-200 text-xs",
          className
        )}
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          <Shield className="h-3 w-3 mr-1" />
          UniLorin Verified
        </Badge>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
          <Award className="h-3 w-3 mr-1" />
          Trusted Artisan
        </Badge>
      </div>
    )
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "bg-green-100 text-green-700 border-green-200",
        className
      )}
    >
      <CheckCircle className="h-4 w-4 mr-1" />
      Verified Artisan
    </Badge>
  )
}

interface QualityBadgeProps {
  rating: number
  totalReviews: number
  className?: string
}

export function QualityBadge({ rating, totalReviews, className }: QualityBadgeProps) {
  if (rating < 4.5 || totalReviews < 10) {
    return null
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "bg-yellow-100 text-yellow-700 border-yellow-200",
        className
      )}
    >
      <Star className="h-3 w-3 mr-1 fill-current" />
      Top Rated
    </Badge>
  )
}

interface ExperienceBadgeProps {
  experienceYears: number
  className?: string
}

export function ExperienceBadge({ experienceYears, className }: ExperienceBadgeProps) {
  if (experienceYears < 2) {
    return null
  }

  const label = experienceYears >= 5 ? "Expert" : "Experienced"
  
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "bg-purple-100 text-purple-700 border-purple-200",
        className
      )}
    >
      {label} ({experienceYears}+ years)
    </Badge>
  )
}