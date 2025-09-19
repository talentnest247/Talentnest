"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, Users, BookOpen, AlertCircle } from "lucide-react"
import type { Skill, Artisan } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

interface EnrollmentFormProps {
  skill: Skill
  artisan: Artisan
  onEnrollmentSuccess: () => void
}

export function EnrollmentForm({ skill, artisan, onEnrollmentSuccess }: EnrollmentFormProps) {
  const [motivation, setMotivation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { user, isAuthenticated } = useAuth()

  const spotsLeft = skill.maxStudents - skill.currentStudents
  const isFullyBooked = spotsLeft <= 0

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isAuthenticated || !user) {
      setError("Please log in to enroll in this skill")
      return
    }

    if (user.role !== "student") {
      setError("Only students can enroll in skills")
      return
    }

    if (isFullyBooked) {
      setError("This skill is fully booked")
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      // Mock enrollment creation
      const enrollment = {
        id: Math.random().toString(36).substr(2, 9),
        studentId: user.id,
        skillId: skill.id,
        artisanId: artisan.id,
        status: "pending" as const,
        progress: 0,
        enrolledAt: new Date(),
      }

      console.log("[v0] Enrollment created:", enrollment)
      onEnrollmentSuccess()
    } catch (error) {
      setError("Failed to enroll. Please try again.")
      console.error("Enrollment failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please{" "}
              <a href="/login" className="text-primary hover:underline">
                log in
              </a>{" "}
              to enroll in this skill.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Enroll in {skill.title}</span>
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleEnrollment}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Skill Summary */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <h3 className="font-semibold">Course Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{skill.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{spotsLeft} spots remaining</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{skill.syllabus.length} modules</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{skill.difficulty}</Badge>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-2xl font-bold text-unilorin-purple">₦{skill.price.toLocaleString()}</p>
            </div>
          </div>

          {/* Requirements */}
          {skill.requirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {skill.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Motivation */}
          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to learn this skill? (Optional)</Label>
            <Textarea
              id="motivation"
              placeholder="Tell the artisan about your goals and motivation..."
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={4}
            />
          </div>

          {/* Artisan Info */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Your Instructor</h3>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <p className="font-medium">
                  {artisan.firstName} {artisan.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{artisan.businessName}</p>
                <p className="text-sm text-muted-foreground">{artisan.experience} years experience</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {artisan.rating} ⭐ ({artisan.totalReviews} reviews)
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting || isFullyBooked} size="lg">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Enrollment...
              </>
            ) : isFullyBooked ? (
              "Skill is Fully Booked"
            ) : (
              `Enroll Now - ₦${skill.price.toLocaleString()}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By enrolling, you agree to our terms of service and payment policy.
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
