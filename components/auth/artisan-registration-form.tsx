"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
import { Eye, EyeOff, Loader2, Shield, AlertCircle } from "lucide-react"

// Form Data Interface
interface RegistrationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  businessName: string
  specialization: string
  customSpecialization: string
  experience: string
  location: string
  bio: string
  certificates: File[]
  workSamples: File[]
  portfolio: File[]
}

// Form Errors Interface
interface FormErrors {
  [key: string]: string
}

export default function ArtisanRegistrationForm() {
  const router = useRouter()
  const { register, isLoading } = useAuth()

  // Form state
  const [formData, setFormData] = useState<RegistrationFormData>({
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
    certificates: [],
    workSamples: [],
    portfolio: [],
  })

  // UI state
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generalError, setGeneralError] = useState("")

  // Specialization options
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

  // Nigerian states
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

  // Experience levels
  const experienceLevels = [
    { value: "0", label: "Less than 1 year" },
    { value: "1", label: "1-2 years" },
    { value: "3", label: "3-5 years" },
    { value: "6", label: "6-10 years" },
    { value: "11", label: "More than 10 years" }
  ]

  // Handle input changes
  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Handle certificate uploads
  const handleCertificatesUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, certificates: [...prev.certificates, ...files] }))
    if (errors.certificates) {
      setErrors(prev => ({ ...prev, certificates: "" }))
    }
  }

  // Handle work sample uploads
  const handleWorkSamplesUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, workSamples: [...prev.workSamples, ...files] }))
    if (errors.workSamples) {
      setErrors(prev => ({ ...prev, workSamples: "" }))
    }
  }

  // Handle portfolio uploads
  const handlePortfolioUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, portfolio: [...prev.portfolio, ...files] }))
    if (errors.portfolio) {
      setErrors(prev => ({ ...prev, portfolio: "" }))
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Personal information validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Business information validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business/Brand name is required"
    }
    if (!formData.specialization) {
      newErrors.specialization = "Please select your specialization"
    }
    if (formData.specialization === "Other" && !formData.customSpecialization.trim()) {
      newErrors.customSpecialization = "Please specify your specialization"
    }
    if (!formData.experience) {
      newErrors.experience = "Please select your years of experience"
    }
    if (!formData.location) {
      newErrors.location = "Please select your location"
    }
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio/Description is required"
    } else if (formData.bio.length < 50) {
      newErrors.bio = "Bio must be at least 50 characters long"
    }

    // Require at least one document (certificate, work sample, or portfolio)
    if (formData.certificates.length === 0 && formData.workSamples.length === 0 && formData.portfolio.length === 0) {
      newErrors.certificates = "Please upload at least one certificate, work sample, or portfolio item"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("")

    if (!validateForm()) {
      setGeneralError("Please correct the errors below and try again")
      return
    }

    try {
      // Upload files to server (if any) and collect URLs
      const uploadFiles = async (files: File[], folder: string) => {
        const urls: string[] = []
        for (const file of files) {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('folder', folder)
          // userId will be filled by backend after user creation; use temp id
          fd.append('userId', 'temp')

          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (res.ok && data.url) {
            urls.push(data.url)
          } else {
            console.error('Upload failed for file', file.name, data)
            throw new Error(data.error || 'Upload failed')
          }
        }
        return urls
      }

      // Upload certificates/workSamples/portfolio and collect URLs
      let certificateUrls: string[] = []
      let workSampleUrls: string[] = []
      let portfolioUrls: string[] = []

      if (formData.certificates.length > 0) {
        certificateUrls = await uploadFiles(formData.certificates, 'certificates')
      }
      if (formData.workSamples.length > 0) {
        workSampleUrls = await uploadFiles(formData.workSamples, 'work_samples')
      }
      if (formData.portfolio.length > 0) {
        portfolioUrls = await uploadFiles(formData.portfolio, 'portfolio')
      }

      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "provider" as const,
        phone: formData.phone,
        businessName: formData.businessName,
        specialization: formData.specialization === "Other" 
          ? formData.customSpecialization 
          : formData.specialization,
        experience: parseInt(formData.experience),
        location: formData.location,
        bio: formData.bio,
        certificates: certificateUrls,
        workSamples: workSampleUrls,
        portfolio: portfolioUrls,
      }

      console.log("Submitting registration with data:", {
        ...userData,
        certificates: `${certificateUrls.length} files`,
        workSamples: `${workSampleUrls.length} files`,
        portfolio: `${portfolioUrls.length} files`,
      })

      const success = await register(userData)
      if (success) {
        console.log("Registration successful, redirecting...")
        router.push('/auth/sign-up-success')
      } else {
        console.error("Registration failed from register function")
        setGeneralError("Registration failed. Please check your information and try again. If the problem persists, contact support.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setGeneralError(`Error: ${errorMessage}. Please try again or contact support if the issue persists.`)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">
                Join as a Service Provider
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg max-w-2xl mx-auto">
                Register to showcase your skills and connect with clients in the UNILORIN community
              </CardDescription>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield className="w-5 h-5 text-blue-200" />
                <span className="text-blue-200 text-sm">Admin verification required</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Error Alert */}
            {generalError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {generalError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-blue-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-blue-900">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-blue-900">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-blue-900">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 800 000 0000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.password ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-blue-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900">Business Information</h3>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label htmlFor="businessName" className="block text-sm font-medium text-blue-900">
                    Business/Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="Enter your business or brand name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.businessName ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-600">{errors.businessName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specialization */}
                  <div className="space-y-2">
                    <label htmlFor="specialization" className="block text-sm font-medium text-blue-900">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.specialization ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                    >
                      <option value="">Select your area of expertise</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {errors.specialization && (
                      <p className="text-sm text-red-600">{errors.specialization}</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label htmlFor="experience" className="block text-sm font-medium text-blue-900">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.experience ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    {errors.experience && (
                      <p className="text-sm text-red-600">{errors.experience}</p>
                    )}
                  </div>
                </div>

                {/* Custom Specialization (conditional) */}
                {formData.specialization === "Other" && (
                  <div className="space-y-2">
                    <label htmlFor="customSpecialization" className="block text-sm font-medium text-blue-900">
                      Specify Your Specialization <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="customSpecialization"
                      name="customSpecialization"
                      type="text"
                      placeholder="Please specify your area of expertise"
                      value={formData.customSpecialization}
                      onChange={(e) => handleInputChange("customSpecialization", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.customSpecialization ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                    />
                    {errors.customSpecialization && (
                      <p className="text-sm text-red-600">{errors.customSpecialization}</p>
                    )}
                  </div>
                )}

                {/* Location */}
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-blue-900">
                    Location (State) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.location ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                  >
                    <option value="">Select your state</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-blue-900">
                    Bio/Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Tell clients about yourself, your services, and what makes you unique (minimum 50 characters)"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.bio ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                  />
                  <div className="flex justify-between text-sm">
                    <span className={formData.bio.length < 50 ? "text-red-600" : "text-blue-600"}>
                      {formData.bio.length}/50 minimum characters
                    </span>
                  </div>
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio}</p>
                  )}
                </div>

                  {/* Documents Upload Section */}
                  <div className="pt-8 pb-4">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-white">
                          <path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Upload Documents</h3>
                        <p className="text-sm text-blue-600">Please upload at least one document to verify your expertise</p>
                      </div>
                      <span className="text-red-500 text-lg">*</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Certificates Upload */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-white">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-green-900">Certificates & Qualifications</h4>
                              <p className="text-xs text-green-700">Academic certificates, professional certifications</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="text-xs text-green-700 bg-green-50 p-2 rounded border">
                              <p><strong>Accepted:</strong> PDF, JPG • <strong>Max size:</strong> 10MB each • <strong>Max files:</strong> 5</p>
                            </div>
                            
                            <label className="relative">
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || [])
                                  if (files.length + formData.certificates.length > 5) {
                                    setErrors(prev => ({ ...prev, certificates: "Maximum 5 files allowed." }))
                                    return
                                  }
                                  const validFiles = files.filter(file => 
                                    ["application/pdf", "image/jpeg"].includes(file.type) && file.size <= 10 * 1024 * 1024
                                  )
                                  if (validFiles.length !== files.length) {
                                    setErrors(prev => ({ ...prev, certificates: "Only PDF and JPG files under 10MB allowed." }))
                                    return
                                  }
                                  handleCertificatesUpload(validFiles)
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Upload certificates"
                              />
                              <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 hover:bg-green-25 transition-colors">
                                <svg className="mx-auto h-8 w-8 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                                <p className="text-sm font-medium text-green-700">Click to upload certificates</p>
                                <p className="text-xs text-green-600">or drag and drop files here</p>
                              </div>
                            </label>

                            {/* Certificate Previews */}
                            {formData.certificates.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {formData.certificates.map((file, idx) => (
                                  <div key={idx} className="relative group bg-white border border-green-200 rounded-lg p-2">
                                    <div className="flex items-start gap-2">
                                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                      </div>
                                      <button
                                        type="button"
                                        title="Remove certificate"
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== idx) }))
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                                      >
                                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {errors.certificates && (
                              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                {errors.certificates}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Work Samples Upload */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-white">
                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-blue-900">Work Samples</h4>
                              <p className="text-xs text-blue-700">Examples of your previous work and projects</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border">
                              <p><strong>Accepted:</strong> PDF, JPG, PNG, WEBP • <strong>Max size:</strong> 10MB each • <strong>Max files:</strong> 5</p>
                            </div>
                            
                            <label className="relative">
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || [])
                                  if (files.length + formData.workSamples.length > 5) {
                                    setErrors(prev => ({ ...prev, workSamples: "Maximum 5 files allowed." }))
                                    return
                                  }
                                  const validFiles = files.filter(file => 
                                    ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 10 * 1024 * 1024
                                  )
                                  if (validFiles.length !== files.length) {
                                    setErrors(prev => ({ ...prev, workSamples: "Only PDF, JPG, PNG, WEBP files under 10MB allowed." }))
                                    return
                                  }
                                  handleWorkSamplesUpload(validFiles)
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Upload work samples"
                              />
                              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-25 transition-colors">
                                <svg className="mx-auto h-8 w-8 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                                <p className="text-sm font-medium text-blue-700">Click to upload work samples</p>
                                <p className="text-xs text-blue-600">or drag and drop files here</p>
                              </div>
                            </label>

                            {/* Work Samples Previews */}
                            {formData.workSamples.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {formData.workSamples.map((file, idx) => (
                                  <div key={idx} className="relative group bg-white border border-blue-200 rounded-lg p-2">
                                    <div className="flex items-start gap-2">
                                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                        {file.type.startsWith('image/') ? (
                                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                          </svg>
                                        ) : (
                                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                          </svg>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                      </div>
                                      <button
                                        type="button"
                                        title="Remove work sample"
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, workSamples: prev.workSamples.filter((_, i) => i !== idx) }))
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                                      >
                                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {errors.workSamples && (
                              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                {errors.workSamples}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Portfolio Upload */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-white">
                                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-purple-900">Portfolio Items</h4>
                              <p className="text-xs text-purple-700">Your best work, business documents, testimonials</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="text-xs text-purple-700 bg-purple-50 p-2 rounded border">
                              <p><strong>Accepted:</strong> PDF, JPG, PNG, WEBP • <strong>Max size:</strong> 10MB each • <strong>Max files:</strong> 5</p>
                            </div>
                            
                            <label className="relative">
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || [])
                                  if (files.length + formData.portfolio.length > 5) {
                                    setErrors(prev => ({ ...prev, portfolio: "Maximum 5 files allowed." }))
                                    return
                                  }
                                  const validFiles = files.filter(file => 
                                    ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 10 * 1024 * 1024
                                  )
                                  if (validFiles.length !== files.length) {
                                    setErrors(prev => ({ ...prev, portfolio: "Only PDF, JPG, PNG, WEBP files under 10MB allowed." }))
                                    return
                                  }
                                  handlePortfolioUpload(validFiles)
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Upload portfolio items"
                              />
                              <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-400 hover:bg-purple-25 transition-colors">
                                <svg className="mx-auto h-8 w-8 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                                <p className="text-sm font-medium text-purple-700">Click to upload portfolio</p>
                                <p className="text-xs text-purple-600">or drag and drop files here</p>
                              </div>
                            </label>

                            {/* Portfolio Previews */}
                            {formData.portfolio.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {formData.portfolio.map((file, idx) => (
                                  <div key={idx} className="relative group bg-white border border-purple-200 rounded-lg p-2">
                                    <div className="flex items-start gap-2">
                                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                                        {file.type.startsWith('image/') ? (
                                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                          </svg>
                                        ) : (
                                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                          </svg>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                      </div>
                                      <button
                                        type="button"
                                        title="Remove portfolio item"
                                        onClick={() => {
                                          setFormData(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== idx) }))
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                                      >
                                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {errors.portfolio && (
                              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                {errors.portfolio}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upload Guidelines */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-blue-900">Upload Guidelines</h4>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• <strong>Certificates:</strong> Academic degrees, professional certifications, training certificates</li>
                            <li>• <strong>Work Samples:</strong> Photos of completed projects, before/after images, product photos</li>
                            <li>• <strong>Portfolio:</strong> Business registration, testimonials, awards, media coverage</li>
                            <li>• <strong>Quality:</strong> Use high-resolution images with clear, readable text</li>
                            <li>• <strong>Privacy:</strong> Remove sensitive personal information like national ID numbers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Upload Guidelines */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-blue-900">Upload Guidelines</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• <strong>Certificates:</strong> Academic degrees, professional certifications, training certificates</li>
                        <li>• <strong>Work Samples:</strong> Photos of completed projects, before/after images, product photos</li>
                        <li>• <strong>Portfolio:</strong> Business registration, testimonials, awards, media coverage</li>
                        <li>• <strong>Quality:</strong> Use high-resolution images with clear, readable text</li>
                        <li>• <strong>Privacy:</strong> Remove sensitive personal information like national ID numbers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Creating Your Account...
                    </>
                  ) : (
                    <>
                      Register as Service Provider
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-blue-50 py-6">
            <div className="w-full text-center">
              <p className="text-blue-700">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}