"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { validateEmail } from "@/lib/validation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrors({ submit: "Invalid email or password" })
        } else if (error.message.includes("Email not confirmed")) {
          setErrors({ submit: "Please check your email and confirm your account first" })
        } else {
          setErrors({ submit: error.message })
        }
        return
      }

      router.push("/dashboard")
    } catch {
      setErrors({ submit: "Login failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="minimal" />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">TalentNest</h1>
            </Link>
            <p className="text-muted-foreground">Welcome back to University of Ilorin&apos;s skills marketplace</p>
          </div>

          <Card className="border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your email address to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email (e.g., name@gmail.com)"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                    }}
                    className={`bg-input border-border ${errors.email ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-secondary hover:text-secondary/80 underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
                    }}
                    className={`bg-input border-border ${errors.password ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <Separator />

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-secondary hover:text-secondary/80 underline font-medium">
                    Create your profile
                  </Link>
                </p>

                <div className="text-xs text-muted-foreground">
                  <p>By signing in, you agree to our</p>
                  <div className="flex justify-center space-x-4 mt-1">
                    <Link href="/terms" className="hover:text-primary underline">
                      Terms of Service
                    </Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-primary underline">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary underline">
              ← Back to TalentNest
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
