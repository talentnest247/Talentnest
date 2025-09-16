"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { validateMatricNumber, generateEmailFromMatric, formatPhoneNumber } from "@/lib/validation"
import { createClient } from "@/lib/supabase/client"
import type { SignupFormData } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle, GraduationCap } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState<SignupFormData>({
    matricNumber: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    whatsappNumber: "",
    faculty: "",
    department: "",
    level: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [skills, setSkills] = useState("")
  const [bio, setBio] = useState("")
  const [accountType, setAccountType] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [updatesAccepted, setUpdatesAccepted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleMatricChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      matricNumber: value,
      email: validateMatricNumber(value) ? generateEmailFromMatric(value) : "",
    }))

    // Clear matric and email errors when user types
    if (errors.matricNumber || errors.email) {
      setErrors((prev) => ({
        ...prev,
        matricNumber: "",
        email: "",
      }))
    }
  }

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    if (!formData.matricNumber) newErrors.matricNumber = "Matric number is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required"
    if (!formData.faculty) newErrors.faculty = "Faculty is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.level) newErrors.level = "Level is required"
    if (!formData.password) newErrors.password = "Password is required"

    // Validate confirm password
    if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            matric_number: formData.matricNumber,
            faculty: formData.faculty,
            department: formData.department,
            level: formData.level,
            phone_number: formatPhoneNumber(formData.phoneNumber),
            whatsapp_number: formData.whatsappNumber
              ? formatPhoneNumber(formData.whatsappNumber)
              : formatPhoneNumber(formData.phoneNumber),
            bio: bio || "",
            skills: skills
              ? skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [],
          },
        },
      })

      if (error) {
        if (error.message.includes("already registered")) {
          setErrors({ email: "This email is already registered" })
        } else if (error.message.includes("Password")) {
          setErrors({ password: error.message })
        } else {
          setErrors({ submit: error.message })
        }
        return
      }

      // Redirect to success page
      router.push("/auth/sign-up-success")
    } catch {
      setErrors({ submit: "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/30">
      <Header variant="minimal" />

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Link href="/" className="inline-block group">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mr-4 group-hover:bg-secondary/80 transition-colors shadow-lg">
                  <GraduationCap className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground group-hover:text-secondary transition-colors">
                    TalentNest
                  </h1>
                  <p className="text-sm text-muted-foreground">University of Ilorin</p>
                </div>
              </div>
            </Link>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join the UNILORIN Community</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect with talented students, showcase your skills, and build meaningful collaborations within our
                campus community.
              </p>
            </div>
          </div>

          <Card className="border-2 border-border shadow-xl bg-background/95 backdrop-blur">
            <CardHeader className="space-y-2 pb-8">
              <CardTitle className="text-2xl font-bold text-center text-foreground">Create Your Profile</CardTitle>
              <CardDescription className="text-center text-lg text-muted-foreground">
                Showcase your skills and connect with fellow UNILORIN students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {errors.submit && (
                <Alert variant="destructive" className="border-2">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="text-base">{errors.submit}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <span className="text-secondary font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="matricNumber" className="text-base font-medium">
                        Matric Number
                      </Label>
                      <Input
                        id="matricNumber"
                        type="text"
                        placeholder="e.g., 20-52hl077"
                        value={formData.matricNumber}
                        onChange={(e) => handleMatricChange(e.target.value)}
                        className={`h-12 text-base bg-input border-2 ${errors.matricNumber ? "border-destructive" : "border-border hover:border-secondary/30 focus:border-secondary"} transition-colors`}
                        required
                      />
                      {errors.matricNumber && (
                        <p className="text-sm text-destructive font-medium">{errors.matricNumber}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Format: XX-XXhlXXX (e.g., 20-52hl077)</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-base font-medium">
                        UNILORIN Student Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        className="h-12 text-base bg-muted border-2 border-border"
                        readOnly
                      />
                      {formData.email && (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                          <CheckCircle className="h-4 w-4" />
                          <span>Email auto-generated from matric number</span>
                        </div>
                      )}
                      {errors.email && <p className="text-sm text-destructive font-medium">{errors.email}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-base font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Your full name as on student records"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={`h-12 text-base bg-input border-2 ${errors.fullName ? "border-destructive" : "border-border hover:border-secondary/30 focus:border-secondary"} transition-colors`}
                        required
                      />
                      {errors.fullName && <p className="text-sm text-destructive font-medium">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="phoneNumber" className="text-base font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="08012345678"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          className={`h-12 text-base bg-input border-2 ${errors.phoneNumber ? "border-destructive" : "border-border hover:border-secondary/30 focus:border-secondary"} transition-colors`}
                          required
                        />
                        {errors.phoneNumber && (
                          <p className="text-sm text-destructive font-medium">{errors.phoneNumber}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="whatsappNumber" className="text-base font-medium">
                          WhatsApp Number (Optional)
                        </Label>
                        <Input
                          id="whatsappNumber"
                          type="tel"
                          placeholder="Same as phone if different"
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                          className="h-12 text-base bg-input border-2 border-border hover:border-secondary/30 focus:border-secondary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="faculty" className="text-base font-medium">
                          Faculty
                        </Label>
                        <Select value={formData.faculty} onValueChange={(value) => handleInputChange("faculty", value)}>
                          <SelectTrigger className="h-12 text-base bg-input border-2 border-border hover:border-secondary/30 focus:border-secondary transition-colors">
                            <SelectValue placeholder="Select your faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arts">Faculty of Arts</SelectItem>
                            <SelectItem value="science">Faculty of Science</SelectItem>
                            <SelectItem value="engineering">Faculty of Engineering & Technology</SelectItem>
                            <SelectItem value="social-sciences">Faculty of Social Sciences</SelectItem>
                            <SelectItem value="education">Faculty of Education</SelectItem>
                            <SelectItem value="law">Faculty of Law</SelectItem>
                            <SelectItem value="agriculture">Faculty of Agriculture</SelectItem>
                            <SelectItem value="management">Faculty of Management Sciences</SelectItem>
                            <SelectItem value="environmental">Faculty of Environmental Sciences</SelectItem>
                            <SelectItem value="communication">
                              Faculty of Communication & Information Sciences
                            </SelectItem>
                            <SelectItem value="life-sciences">Faculty of Life Sciences</SelectItem>
                            <SelectItem value="pharmacy">Faculty of Pharmaceutical Sciences</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="department" className="text-base font-medium">
                          Department
                        </Label>
                        <Input
                          id="department"
                          type="text"
                          placeholder="Your department"
                          value={formData.department}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          className="h-12 text-base bg-input border-2 border-border hover:border-secondary/30 focus:border-secondary transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="level" className="text-base font-medium">
                        Current Level
                      </Label>
                      <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                        <SelectTrigger className="h-12 text-base bg-input border-2 border-border hover:border-secondary/30 focus:border-secondary transition-colors">
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100L">100 Level</SelectItem>
                          <SelectItem value="200L">200 Level</SelectItem>
                          <SelectItem value="300L">300 Level</SelectItem>
                          <SelectItem value="400L">400 Level</SelectItem>
                          <SelectItem value="500L">500 Level</SelectItem>
                          <SelectItem value="600L">600 Level</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <span className="text-secondary font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Account Setup</h3>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-base font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`h-12 text-base bg-input border-2 ${errors.password ? "border-destructive" : "border-border hover:border-secondary/30 focus:border-secondary"} transition-colors`}
                        required
                      />
                      {errors.password && <p className="text-sm text-destructive font-medium">{errors.password}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-base font-medium">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`h-12 text-base bg-input border-2 ${errors.confirmPassword ? "border-destructive" : "border-border hover:border-secondary/30 focus:border-secondary"} transition-colors`}
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive font-medium">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <span className="text-secondary font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Profile Setup</h3>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="accountType" className="text-base font-medium">
                        I want to:
                      </Label>
                      <Select value={accountType} onValueChange={setAccountType}>
                        <SelectTrigger className="h-12 text-base bg-input border-2 border-border hover:border-secondary/30 focus:border-secondary transition-colors">
                          <SelectValue placeholder="Choose your primary goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offer-services">Offer my skills and services</SelectItem>
                          <SelectItem value="find-services">Find talented students for projects</SelectItem>
                          <SelectItem value="both">Both offer and find services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="skills" className="text-base font-medium">
                        Your Skills (Optional)
                      </Label>
                      <Textarea
                        id="skills"
                        placeholder="e.g., Web Development, Graphic Design, Photography, Writing, Tutoring..."
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="text-base bg-input border-2 border-border hover:border-secondary/30 focus:border-secondary transition-colors min-h-[100px] resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        Separate skills with commas. You can add more details later.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bio" className="text-base font-medium">
                        Brief Bio (Optional)
                      </Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell others about yourself and what you're passionate about..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="text-base bg-input border-2 border-border hover:border-secondary/30 focus:border-secondary transition-colors min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        className="mt-1 w-5 h-5"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      />
                      <div className="text-base">
                        <Label htmlFor="terms" className="font-normal cursor-pointer leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="text-secondary hover:text-secondary/80 underline font-medium">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-secondary hover:text-secondary/80 underline font-medium"
                          >
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    </div>
                    {errors.terms && <p className="text-sm text-destructive font-medium">{errors.terms}</p>}

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="updates"
                        className="mt-1 w-5 h-5"
                        checked={updatesAccepted}
                        onCheckedChange={(checked) => setUpdatesAccepted(checked as boolean)}
                      />
                      <Label htmlFor="updates" className="text-base font-normal cursor-pointer leading-relaxed">
                        I&apos;d like to receive updates about new features and community highlights
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Your Profile..." : "Create My TalentNest Profile"}
                </Button>
              </form>

              <div className="text-center space-y-6 pt-6 border-t border-border">
                <p className="text-base text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-secondary hover:text-secondary/80 underline font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-base text-muted-foreground hover:text-foreground underline font-medium transition-colors"
            >
              ← Back to TalentNest
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
