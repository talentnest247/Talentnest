'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Users, AlertCircle, Chrome } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Types for registration data
interface RegistrationFormData {
  // Common fields
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: 'student' | 'artisan' | ''
  
  // Student fields
  studentId: string
  department: string
  customDepartment: string
  level: string
  
  // Artisan fields
  businessName: string
  specialization: string
  customSpecialization: string
  experience: string
  location: string
}

// Department options for students
const departments = [
  "Computer Science", "Engineering", "Medicine", "Law", "Business Administration",
  "Economics", "Psychology", "Biology", "Chemistry", "Physics", "Mathematics",
  "English Language", "History", "Political Science", "Sociology", "Philosophy",
  "Fine Arts", "Music", "Theatre Arts", "Architecture", "Agriculture", "Other"
]

// Academic levels
const academicLevels = [
  "100", "200", "300", "400", "500", "Masters", "PhD"
]

// Artisan specializations
const specializations = [
  // Fashion & Beauty
  "Fashion Design", "Tailoring", "Shoe Making", "Bag Making", "Hair Styling", 
  "Makeup Artistry", "Nail Art", "Jewelry Making", "Textile Design",
  
  // Crafts & Art
  "Pottery", "Sculpture", "Painting", "Drawing", "Woodworking", "Metalwork",
  "Leatherwork", "Beadwork", "Embroidery", "Photography",
  
  // Tech & Digital
  "Web Development", "Mobile App Development", "Graphic Design", "Video Editing",
  "Digital Marketing", "Content Creation", "UI/UX Design",
  
  // Food & Culinary
  "Catering", "Baking", "Pastry Making", "Food Photography", "Nutrition Consulting",
  
  // Services
  "Tutoring", "Music Instruction", "Dance Instruction", "Event Planning",
  "Home Repairs", "Cleaning Services", "Other"
]

// Experience levels
const experienceLevels = [
  "1 year", "2 years", "3 years", "4 years", "5 years", 
  "6 years", "7 years", "8 years", "9 years", "10+ years"
]

// Location options (Ilorin areas)
const locations = [
  "Ilorin South", "Ilorin West", "Ilorin East", "Asa", "Moro",
  "University of Ilorin", "Kwara State Polytechnic", "Online Services",
  "Mobile Services (Travel to Client)", "Other"
]

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    studentId: "",
    department: "",
    customDepartment: "",
    level: "",
    businessName: "",
    specialization: "",
    customSpecialization: "",
    experience: "",
    location: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle input changes
  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Common field validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.role) newErrors.role = "Please select your role"

    // Role-specific validation
    if (formData.role === 'student') {
      if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required"
      if (!formData.department) newErrors.department = "Department is required"
      if (formData.department === 'Other' && !formData.customDepartment.trim()) {
        newErrors.customDepartment = "Please specify your department"
      }
      if (!formData.level) newErrors.level = "Academic level is required"
    }

    if (formData.role === 'artisan') {
      if (!formData.businessName.trim()) newErrors.businessName = "Business/Workshop name is required"
      if (!formData.specialization) newErrors.specialization = "Specialization is required"
      if (formData.specialization === 'Other' && !formData.customSpecialization.trim()) {
        newErrors.customSpecialization = "Please specify your specialization"
      }
      if (!formData.experience) newErrors.experience = "Experience level is required"
      if (!formData.location) newErrors.location = "Location is required"
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const registrationData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        department: formData.department === 'Other' ? formData.customDepartment : formData.department,
        specialization: formData.specialization === 'Other' ? formData.customSpecialization : formData.specialization
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.message })
        } else {
          setErrors({ submit: data.message || 'Registration failed' })
        }
        return
      }

      // Registration successful
      router.push('/auth/sign-up-success')
    } catch {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google OAuth
  const handleGoogleSignup = () => {
    window.location.href = '/api/auth/signin/google'
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="minimal" />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="flex flex-col items-center mb-2">
                <div className="w-16 h-16 mb-3 relative">
                  <Image 
                    src="/unilorin-logo.png" 
                    alt="University of Ilorin Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-3xl font-serif font-bold text-primary">
                  TalentNest
                </h1>
                <span className="text-sm text-muted-foreground font-medium">University of Ilorin</span>
              </div>
            </Link>
            <p className="text-muted-foreground">
              Join the University of Ilorin skills marketplace
            </p>
          </div>

          <Card className="border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Connect with skilled artisans and eager learners
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-all duration-300"
                onClick={handleGoogleSignup}
              >
                <Chrome className="mr-3 h-5 w-5 text-blue-600" />
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">Or register with email</span>
                </div>
              </div>

              {/* Error Messages */}
              {errors.submit && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errors.submit}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`h-11 ${errors.firstName ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`h-11 ${errors.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`h-11 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 123 456 7890"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`h-11 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`h-11 pr-10 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`h-11 pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-purple-600" />
                    Choose Your Role
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={formData.role === 'student' ? 'default' : 'outline'}
                      className={`h-20 flex-col space-y-2 ${
                        formData.role === 'student' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => handleInputChange('role', 'student')}
                    >
                      <User className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-semibold">Student</div>
                        <div className="text-xs opacity-80">Learn artisan skills</div>
                      </div>
                    </Button>

                    <Button
                      type="button"
                      variant={formData.role === 'artisan' ? 'default' : 'outline'}
                      className={`h-20 flex-col space-y-2 ${
                        formData.role === 'artisan' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                      onClick={() => handleInputChange('role', 'artisan')}
                    >
                      <Users className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-semibold">Artisan</div>
                        <div className="text-xs opacity-80">Teach & offer services</div>
                      </div>
                    </Button>
                  </div>
                  {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
                </div>

                {/* Student-Specific Fields */}
                {formData.role === 'student' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 flex items-center">
                      <Badge className="mr-2 bg-blue-600">Student</Badge>
                      Academic Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID *</Label>
                        <Input
                          id="studentId"
                          type="text"
                          placeholder="e.g., 21/55HA001"
                          value={formData.studentId}
                          onChange={(e) => handleInputChange('studentId', e.target.value)}
                          className={`h-11 ${errors.studentId ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        {errors.studentId && <p className="text-sm text-red-600">{errors.studentId}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Academic Level *</Label>
                        <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                          <SelectTrigger className={`h-11 ${errors.level ? 'border-red-300' : ''}`}>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            {academicLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level === 'Masters' || level === 'PhD' ? level : `${level} Level`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.level && <p className="text-sm text-red-600">{errors.level}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                        <SelectTrigger className={`h-11 ${errors.department ? 'border-red-300' : ''}`}>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                    </div>

                    {formData.department === 'Other' && (
                      <div className="space-y-2">
                        <Label htmlFor="customDepartment">Specify Department *</Label>
                        <Input
                          id="customDepartment"
                          type="text"
                          placeholder="Enter your department"
                          value={formData.customDepartment}
                          onChange={(e) => handleInputChange('customDepartment', e.target.value)}
                          className={`h-11 ${errors.customDepartment ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        {errors.customDepartment && <p className="text-sm text-red-600">{errors.customDepartment}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Artisan-Specific Fields */}
                {formData.role === 'artisan' && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 flex items-center">
                      <Badge className="mr-2 bg-purple-600">Artisan</Badge>
                      Professional Information
                    </h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business/Workshop Name *</Label>
                      <Input
                        id="businessName"
                        type="text"
                        placeholder="e.g., Adunni's Fashion Hub"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className={`h-11 ${errors.businessName ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                      {errors.businessName && <p className="text-sm text-red-600">{errors.businessName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization *</Label>
                        <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                          <SelectTrigger className={`h-11 ${errors.specialization ? 'border-red-300' : ''}`}>
                            <SelectValue placeholder="What's your specialty?" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {specializations.map((spec) => (
                              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.specialization && <p className="text-sm text-red-600">{errors.specialization}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience Level *</Label>
                        <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                          <SelectTrigger className={`h-11 ${errors.experience ? 'border-red-300' : ''}`}>
                            <SelectValue placeholder="Years of experience" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map((exp) => (
                              <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.experience && <p className="text-sm text-red-600">{errors.experience}</p>}
                      </div>
                    </div>

                    {formData.specialization === 'Other' && (
                      <div className="space-y-2">
                        <Label htmlFor="customSpecialization">Specify Specialization *</Label>
                        <Input
                          id="customSpecialization"
                          type="text"
                          placeholder="Enter your specialization"
                          value={formData.customSpecialization}
                          onChange={(e) => handleInputChange('customSpecialization', e.target.value)}
                          className={`h-11 ${errors.customSpecialization ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        {errors.customSpecialization && <p className="text-sm text-red-600">{errors.customSpecialization}</p>}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="location">Service Location *</Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                        <SelectTrigger className={`h-11 ${errors.location ? 'border-red-300' : ''}`}>
                          <SelectValue placeholder="Where do you provide services?" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => {
                        setTermsAccepted(checked as boolean)
                        if (errors.terms) {
                          setErrors(prev => ({ ...prev, terms: "" }))
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="text-sm leading-6">
                      <Label htmlFor="terms" className="font-medium cursor-pointer">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                          Privacy Policy
                        </Link>
                        *
                      </Label>
                    </div>
                  </div>
                  {errors.terms && <p className="text-sm text-red-600 ml-6">{errors.terms}</p>}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center pt-6 border-t">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
