"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import type { User } from "@/lib/types"

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "" as "student" | "artisan",
    // Student specific fields
    studentId: "",
    department: "",
    customDepartment: "",
    level: "",
    // Artisan specific fields (for UI, but not sent to backend)
    businessName: "",
    specialization: "",
    customSpecialization: "",
    experience: "",
    location: "",
    bio: "",
    certificates: [] as string[],
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const { register, isLoading } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCertificateUpload = (urls: string[]) => {
    setFormData((prev) => ({ 
      ...prev, 
      certificates: [...prev.certificates, ...urls] 
    }))
  }

  const handleCertificateRemove = (url: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      certificates: prev.certificates.filter(cert => cert !== url) 
    }))
  }

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.role
    ) {
      return "Please fill in all required fields"
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long"
    }

    if (formData.role === "student" && (!formData.studentId || !formData.department || !formData.level)) {
      return "Please fill in all student information"
    }

    // Additional validation for custom department
    if (formData.role === "student" && formData.department === "Other" && !formData.customDepartment) {
      return "Please specify your department"
    }

    if (
      formData.role === "artisan" &&
      (!formData.businessName || !formData.specialization || !formData.experience || !formData.location || !formData.bio)
    ) {
      return "Please fill in all artisan information including bio"
    }

    // Additional validation for custom specialization
    if (formData.role === "artisan" && formData.specialization === "Other" && !formData.customSpecialization) {
      return "Please specify your specialization"
    }

    // Certificate validation for artisans
    if (formData.role === "artisan" && formData.certificates.length === 0) {
      return "Please upload at least one certificate or proof of expertise"
    }

    // Optional profile checks


    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role as "student" | "artisan",
      phone: formData.phone,
      // Student specific data
      studentId: formData.role === "student" ? formData.studentId : undefined,
      department: formData.role === "student" ? (formData.department === "Other" ? formData.customDepartment : formData.department) : undefined,
      level: formData.role === "student" ? formData.level : undefined,
      // Artisan specific data
      businessName: formData.role === "artisan" ? formData.businessName : undefined,
      specialization: formData.role === "artisan" ? (formData.specialization === "Other" ? formData.customSpecialization : formData.specialization) : undefined,
      experience: formData.role === "artisan" ? parseInt(formData.experience) : undefined,
      location: formData.role === "artisan" ? formData.location : undefined,
      bio: formData.role === "artisan" ? formData.bio : undefined,
      certificates: formData.role === "artisan" ? formData.certificates : undefined,
    }

    const success = await register(userData)
    if (success) {
      onSuccess?.()
    } else {
      setError("Registration failed. Please try again.")
    }
  }

  const handleGoogleSignUp = async () => {
    setError("")
    try {
      // Redirect to Google OAuth
      window.location.href = '/api/auth/signin/google'
    } catch (error) {
      console.error("Google sign-up error:", error)
      setError("Google sign-up failed. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto glass-card shadow-2xl animate-in fade-in slide-in-from-bottom delay-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Join UNILORIN Community</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Create your account to connect with artisans and learn new skills
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="border-input bg-background/50 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="border-input bg-background/50 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@unilorin.edu.ng"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="border-input bg-background/50 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234 xxx xxx xxxx"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className="border-input bg-background/50 backdrop-blur-sm"
            />
          </div>



          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="border-input bg-background/50 backdrop-blur-sm"
                />
                <Button
                  {...({ type: "button", variant: "ghost", size: "sm" } as any)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  className="border-input bg-background/50 backdrop-blur-sm"
                />
                <Button
                  {...({ type: "button", variant: "ghost", size: "sm" } as any)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">I am a *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "student" | "artisan") => handleInputChange("role", value)}
            >
              <SelectTrigger className="h-12 border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-white [&>span]:text-white">
                <SelectValue placeholder="Select your role" className="text-white" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border min-w-[320px]">
                <SelectItem value="student" className="h-16 p-4 cursor-pointer hover:bg-accent focus:bg-accent data-[state=checked]:bg-accent">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="h-3 w-3 bg-blue-500 rounded-full shadow-sm flex-shrink-0"></div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-foreground">Student</div>
                      <div className="text-sm text-muted-foreground">I want to learn new skills</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="artisan" className="h-16 p-4 cursor-pointer hover:bg-accent focus:bg-accent data-[state=checked]:bg-accent">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="h-3 w-3 bg-orange-500 rounded-full shadow-sm flex-shrink-0"></div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-foreground">Artisan</div>
                      <div className="text-sm text-muted-foreground">I want to teach my skills</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student-specific fields */}
          {formData.role === "student" && (
            <div className="space-y-4 p-6 border rounded-lg glass-card">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <h3 className="font-semibold text-primary">Student Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    placeholder="e.g., 19/55HA001"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className="h-12 border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-white [&>span]:text-white">
                      <SelectValue placeholder="Select your department" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border max-h-60 overflow-auto">
                      <SelectItem value="Computer Science" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Computer Science</SelectItem>
                      <SelectItem value="Electrical Engineering" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Electrical Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Civil Engineering</SelectItem>
                      <SelectItem value="Chemical Engineering" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Chemical Engineering</SelectItem>
                      <SelectItem value="Business Administration" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Business Administration</SelectItem>
                      <SelectItem value="Economics" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Economics</SelectItem>
                      <SelectItem value="Accounting" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Accounting</SelectItem>
                      <SelectItem value="Mass Communication" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Mass Communication</SelectItem>
                      <SelectItem value="English Language" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">English Language</SelectItem>
                      <SelectItem value="Mathematics" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Mathematics</SelectItem>
                      <SelectItem value="Physics" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Physics</SelectItem>
                      <SelectItem value="Chemistry" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Chemistry</SelectItem>
                      <SelectItem value="Biology" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Biology</SelectItem>
                      <SelectItem value="Medicine" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Medicine</SelectItem>
                      <SelectItem value="Law" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Law</SelectItem>
                      <SelectItem value="Agriculture" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Agriculture</SelectItem>
                      <SelectItem value="Veterinary Medicine" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Veterinary Medicine</SelectItem>
                      <SelectItem value="Pharmacy" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Pharmacy</SelectItem>
                      <SelectItem value="Education" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Education</SelectItem>
                      <SelectItem value="Arts" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Arts</SelectItem>
                      <SelectItem value="Social Sciences" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Social Sciences</SelectItem>
                      <SelectItem value="Other" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Custom Department Input - Shows when "Other" is selected */}
                {formData.department === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customDepartment" className="text-blue-200">Specify Your Department *</Label>
                    <Input
                      id="customDepartment"
                      placeholder="Enter your department name"
                      value={formData.customDepartment || ""}
                      onChange={(e) => handleInputChange("customDepartment", e.target.value)}
                      className="h-12 border-2 border-blue-300 bg-white dark:bg-gray-800 hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Please enter the full name of your department</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="level">Academic Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                    <SelectTrigger className="h-12 border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-white [&>span]:text-white">
                      <SelectValue placeholder="Choose your level" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border max-h-80 overflow-auto min-w-[350px]">
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 sticky top-0">
                        Undergraduate Levels
                      </div>
                      <SelectItem value="100" className="h-14 p-3 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-green-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">100 Level</div>
                            <div className="text-sm text-muted-foreground">First Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="200" className="h-14 p-3 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-blue-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">200 Level</div>
                            <div className="text-sm text-muted-foreground">Second Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="300" className="h-14 p-3 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-yellow-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">300 Level</div>
                            <div className="text-sm text-muted-foreground">Third Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="400" className="h-14 p-3 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-orange-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">400 Level</div>
                            <div className="text-sm text-muted-foreground">Fourth Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="500" className="h-14 p-3 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-purple-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">500 Level</div>
                            <div className="text-sm text-muted-foreground">Fifth Year Undergraduate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 border-t border-border mt-1 sticky top-8">
                        Postgraduate Levels
                      </div>
                      <SelectItem value="masters" className="h-14 p-3 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-indigo-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">Masters Degree</div>
                            <div className="text-sm text-muted-foreground">Postgraduate (MSc/MA)</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="phd" className="h-14 p-3 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-red-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">PhD/Doctorate</div>
                            <div className="text-sm text-muted-foreground">Doctoral Studies</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Artisan-specific fields */}
          {formData.role === "artisan" && (
            <div className="space-y-4 p-6 border rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">Artisan Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-blue-200">Business/Workshop Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Fatima's Fashion House"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                    <SelectTrigger className="h-12 border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-white [&>span]:text-white">
                      <SelectValue placeholder="Select your specialization" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border max-h-80 overflow-auto min-w-[350px]">
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 sticky top-0">
                        Fashion & Textiles
                      </div>
                      <SelectItem value="Fashion Design" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Fashion Design</SelectItem>
                      <SelectItem value="Tailoring" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Tailoring & Alterations</SelectItem>
                      <SelectItem value="Embroidery" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Embroidery & Decoration</SelectItem>
                      <SelectItem value="Textile Design" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Textile Design</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 border-t border-border mt-1 sticky top-8">
                        Crafts & Arts
                      </div>
                      <SelectItem value="Jewelry Making" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Jewelry Making</SelectItem>
                      <SelectItem value="Pottery" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Pottery & Ceramics</SelectItem>
                      <SelectItem value="Woodworking" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Woodworking & Carpentry</SelectItem>
                      <SelectItem value="Leather Work" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Leather Work</SelectItem>
                      <SelectItem value="Beadwork" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Beadwork & Accessories</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 border-t border-border mt-1 sticky top-16">
                        Technology & Digital
                      </div>
                      <SelectItem value="Web Development" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Web Development</SelectItem>
                      <SelectItem value="Graphic Design" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Graphic Design</SelectItem>
                      <SelectItem value="Photography" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Photography</SelectItem>
                      <SelectItem value="Digital Marketing" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Digital Marketing</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 border-t border-border mt-1 sticky top-24">
                        Food & Culinary
                      </div>
                      <SelectItem value="Catering" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Catering & Event Planning</SelectItem>
                      <SelectItem value="Baking" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Baking & Pastry</SelectItem>
                      <SelectItem value="Traditional Cooking" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Traditional Cooking</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 border-t border-border mt-1 sticky top-32">
                        Services
                      </div>
                      <SelectItem value="Hair Styling" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Hair Styling & Beauty</SelectItem>
                      <SelectItem value="Makeup Artistry" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Makeup Artistry</SelectItem>
                      <SelectItem value="Event Planning" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Event Planning</SelectItem>
                      <SelectItem value="Other" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Other Specialization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Custom Specialization Input - Shows when "Other" is selected */}
                {formData.specialization === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customSpecialization" className="text-blue-200">Specify Your Specialization *</Label>
                    <Input
                      id="customSpecialization"
                      placeholder="Enter your specialization"
                      value={formData.customSpecialization || ""}
                      onChange={(e) => handleInputChange("customSpecialization", e.target.value)}
                      className="h-12 border-2 border-orange-300 bg-white dark:bg-gray-800 hover:border-orange-500 focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-gray-100 font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Please describe your area of expertise</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger className="h-12 border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-white [&>span]:text-white">
                      <SelectValue placeholder="Select experience level" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border min-w-[320px]">
                      <SelectItem value="1" className="h-16 p-4 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-green-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">1 Year</div>
                            <div className="text-sm text-muted-foreground">Beginner</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="2" className="h-16 p-4 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-blue-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">2-3 Years</div>
                            <div className="text-sm text-muted-foreground">Developing Skills</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="4" className="h-16 p-4 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-yellow-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">4-5 Years</div>
                            <div className="text-sm text-muted-foreground">Intermediate</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="6" className="h-16 p-4 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-orange-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">6-10 Years</div>
                            <div className="text-sm text-muted-foreground">Advanced</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="11" className="h-16 p-4 cursor-pointer hover:bg-accent focus:bg-accent">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-3 w-3 bg-purple-500 rounded-full shadow-sm flex-shrink-0"></div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-foreground">10+ Years</div>
                            <div className="text-sm text-muted-foreground">Expert/Master</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger className="h-12 border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all text-white [&>span]:text-white">
                      <SelectValue placeholder="Select your location" className="text-white" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border max-h-80 overflow-auto">
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 sticky top-0">
                        Ilorin Areas
                      </div>
                      <SelectItem value="Ilorin Central" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Ilorin Central</SelectItem>
                      <SelectItem value="Ilorin East" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Ilorin East</SelectItem>
                      <SelectItem value="Ilorin West" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Ilorin West</SelectItem>
                      <SelectItem value="Ilorin South" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Ilorin South</SelectItem>
                      <SelectItem value="University Area" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">University Area (UNILORIN)</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 border-t border-border mt-1 sticky top-8">
                        Kwara State
                      </div>
                      <SelectItem value="Offa" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Offa</SelectItem>
                      <SelectItem value="Omu-Aran" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Omu-Aran</SelectItem>
                      <SelectItem value="Lafiagi" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Lafiagi</SelectItem>
                      <SelectItem value="Patigi" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Patigi</SelectItem>
                      <SelectItem value="Kaiama" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Kaiama</SelectItem>
                      <SelectItem value="Other Kwara" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Other Areas in Kwara</SelectItem>
                      
                      <div className="px-3 py-2 text-sm font-semibold text-primary uppercase tracking-wide bg-accent/50 border-t border-border mt-1 sticky top-16">
                        Online Services
                      </div>
                      <SelectItem value="Online Only" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Online Services Only</SelectItem>
                      <SelectItem value="Hybrid" className="h-10 p-3 cursor-pointer hover:bg-accent focus:bg-accent text-foreground">Hybrid (Online + Physical)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Bio Field for Artisans */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your background, expertise, and what makes you unique as an artisan..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="min-h-[120px] border-input bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Certificate Upload for Artisans */}
                <div className="space-y-2">
                  <FileUpload
                    onUpload={handleCertificateUpload}
                    onRemove={handleCertificateRemove}
                    uploadedFiles={formData.certificates}
                    maxFiles={3}
                    label="Certificates & Proof of Expertise"
                    description="Upload certificates, portfolios, or other documents that showcase your skills and expertise. This helps verify your credentials."
                    required={true}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload up to 3 files (PDF, JPG, PNG, WEBP). These will be reviewed by our admin team for verification.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* Google Sign Up */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-input bg-background/50 backdrop-blur-sm hover:bg-background/80"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 py-1 text-muted-foreground relative z-10">Or sign up with email</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account?</span>{" "}
            <Link href="/login" className="text-primary hover:underline transition-colors">
              Sign in here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
