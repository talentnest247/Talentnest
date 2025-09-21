"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { Eye, EyeOff, Loader2, Briefcase, Shield, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function ArtisanRegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCertificatesUpload = (urls: string[]) => {
    setFormData(prev => ({ ...prev, certificates: [...prev.certificates, ...urls] }))
  }

  const handleCertificatesRemove = (url: string) => {
    setFormData(prev => ({ ...prev, certificates: prev.certificates.filter(cert => cert !== url) }))
  }

  const specializations = [
    "Fashion Design & Tailoring",
    "Hair Styling & Barbing",
    "Makeup & Beauty",
    "Photography",
    "Graphic Design",
    "Web Development",
    "Event Planning",
    "Catering & Cooking",
    "Carpentry & Furniture",
    "Electrical Works",
    "Plumbing",
    "Auto Mechanics",
    "Phone Repairs",
    "Computer Repairs",
    "Tutoring & Teaching",
    "Music & Entertainment",
    "Art & Crafts",
    "Fitness Training",
    "Other"
  ]

  const nigerianStates = [
    "Kwara State", "Lagos State", "Abuja (FCT)", "Oyo State", "Osun State",
    "Ogun State", "Ondo State", "Ekiti State", "Edo State", "Delta State",
    "Rivers State", "Cross River State", "Akwa Ibom State", "Abia State",
    "Imo State", "Enugu State", "Ebonyi State", "Anambra State", "Kano State",
    "Kaduna State", "Katsina State", "Sokoto State", "Kebbi State", "Niger State",
    "Plateau State", "Benue State", "Nasarawa State", "Taraba State", "Adamawa State",
    "Bauchi State", "Gombe State", "Yobe State", "Borno State", "Jigawa State",
    "Zamfara State", "Kogi State", "Bayelsa State"
  ]

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      return "Please fill in all required fields"
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long"
    }

    if (!formData.email.includes("@")) {
      return "Please enter a valid email address"
    }

    // Artisan specific validation
    if (!formData.businessName || !formData.specialization || !formData.experience || !formData.location || !formData.bio) {
      return "Please fill in all artisan information including bio"
    }

    if (formData.specialization === "Other" && !formData.customSpecialization) {
      return "Please specify your specialization"
    }

    if (formData.certificates.length === 0) {
      return "Please upload at least one certificate or proof of expertise"
    }

    if (formData.bio.length < 50) {
      return "Bio must be at least 50 characters long"
    }

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
      role: "artisan" as const,
      phone: formData.phone,
      businessName: formData.businessName,
      specialization: formData.specialization === "Other" ? formData.customSpecialization : formData.specialization,
      experience: parseInt(formData.experience),
      location: formData.location,
      bio: formData.bio,
      certificates: formData.certificates,
    }

    const success = await register(userData)
    if (success) {
      router.push('/auth/sign-up-success')
    } else {
      setError("Registration failed. Please check your information and try again.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto glass-card shadow-2xl animate-in fade-in slide-in-from-bottom delay-200">
      <CardHeader className="space-y-1 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Artisan Registration</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Join as a skilled artisan to share your expertise with the UNILORIN community
        </CardDescription>
        
        {/* Verification Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">Verification Required</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                All artisan applications undergo admin verification to ensure quality and authenticity. 
                You&apos;ll receive an email notification about your application status.
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
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
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className="border-input bg-background/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@gmail.com"
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
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Business Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="businessName">Business/Brand Name *</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="e.g., John&apos;s Fashion Studio"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                required
                className="border-input bg-background/50 backdrop-blur-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                  <SelectTrigger className="border-input bg-background/50 backdrop-blur-sm">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                  <SelectTrigger className="border-input bg-background/50 backdrop-blur-sm">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="4">4 years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.specialization === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="customSpecialization">Specify Specialization *</Label>
                <Input
                  id="customSpecialization"
                  type="text"
                  placeholder="Enter your specialization"
                  value={formData.customSpecialization}
                  onChange={(e) => handleInputChange("customSpecialization", e.target.value)}
                  required
                  className="border-input bg-background/50 backdrop-blur-sm"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger className="border-input bg-background/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio/Description *</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your experience, and what makes you unique as an artisan (minimum 50 characters)"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                required
                className="border-input bg-background/50 backdrop-blur-sm min-h-[100px]"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/500 characters
              </div>
            </div>
          </div>

          {/* Certificates Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Certification & Portfolio</h3>
            
            <div className="space-y-2">
              <Label>Upload Certificates/Portfolio *</Label>
              <FileUpload
                onUpload={handleCertificatesUpload}
                onRemove={handleCertificatesRemove}
                uploadedFiles={formData.certificates}
                maxFiles={5}
                acceptedTypes={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                label="Certificates & Portfolio"
                description="Upload certificates, portfolio images, or any proof of your expertise (Max 5 files, 5MB each)"
                required={true}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Account Security</h3>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="border-input bg-background/50 backdrop-blur-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
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
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              "Submit Artisan Application"
            )}
          </Button>

          <div className="text-center text-sm space-y-2">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                📧 After submission, you&apos;ll receive an email confirmation. Admin review typically takes 1-3 business days.
              </p>
            </div>
            
            <div>
              <span className="text-muted-foreground">Already have an account?</span>{" "}
              <Link href="/login" className="text-purple-600 hover:underline transition-colors">
                Sign in here
              </Link>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}