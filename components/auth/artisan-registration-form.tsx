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

  // Preview URLs for display (object URLs)
  const [previews, setPreviews] = useState({
    certificates: [] as string[],
    workSamples: [] as string[],
    portfolio: [] as string[],
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
  const handleCertificatesUpload = (files: File[], urls: string[]) => {
    setFormData(prev => ({ ...prev, certificates: [...prev.certificates, ...files] }))
    setPreviews(prev => ({ ...prev, certificates: [...prev.certificates, ...urls] }))
    if (errors.certificates) {
      setErrors(prev => ({ ...prev, certificates: "" }))
    }
  }

  // Handle work sample uploads
  const handleWorkSamplesUpload = (files: File[], urls: string[]) => {
    setFormData(prev => ({ ...prev, workSamples: [...prev.workSamples, ...files] }))
    setPreviews(prev => ({ ...prev, workSamples: [...prev.workSamples, ...urls] }))
    if (errors.workSamples) {
      setErrors(prev => ({ ...prev, workSamples: "" }))
    }
  }

  // Handle portfolio uploads
  const handlePortfolioUpload = (files: File[], urls: string[]) => {
    setFormData(prev => ({ ...prev, portfolio: [...prev.portfolio, ...files] }))
    setPreviews(prev => ({ ...prev, portfolio: [...prev.portfolio, ...urls] }))
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

      const success = await register(userData)
      if (success) {
        router.push('/auth/sign-up-success')
      } else {
        setGeneralError("Registration failed. Please check your information and try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setGeneralError("An unexpected error occurred. Please try again.")
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

                  {/* Certificates/Portfolio Upload Section */}
                  <div className="pt-8 pb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-blue-600"><path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/></svg>
                      <span className="text-lg font-semibold text-blue-900">Upload Documents <span className="text-red-500">*</span></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Certificates Upload */}
                      <div className="border rounded-lg p-4 bg-white">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Certificates</h4>
                        <p className="text-xs text-blue-600 mb-3">Upload qualification certificates (PDF, JPG). Max 5 files.</p>
                        <label className="w-full block">
                          <input
                            aria-label="Upload certificates"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg"
                            onChange={e => {
                              const files = Array.from(e.target.files || [])
                              if (files.length + formData.certificates.length > 5) {
                                setErrors(prev => ({ ...prev, certificates: "Maximum 5 files allowed." }))
                                return
                              }
                              const validFiles = files.filter(file => ["application/pdf","image/jpeg"].includes(file.type))
                              if (validFiles.length !== files.length) {
                                setErrors(prev => ({ ...prev, certificates: "Only PDF and JPG allowed for certificates." }))
                                return
                              }
                              const urls = validFiles.map(file => URL.createObjectURL(file))
                              handleCertificatesUpload(validFiles, urls)
                            }}
                            className="w-full text-sm text-blue-600"
                          />
                        </label>
                        {previews.certificates.length > 0 && (
                          <ul className="mt-3 text-sm text-blue-700">
                            {previews.certificates.map((url, idx) => (
                              <li key={idx} className="flex items-center justify-between py-1 border-b last:border-b-0">
                                <a href={url} target="_blank" rel="noreferrer" className="truncate underline">{url.split('/').pop()}</a>
                                <button className="text-xs text-red-600" onClick={() => {
                                  setFormData(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== idx) }))
                                  setPreviews(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== idx) }))
                                }}>Remove</button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {errors.certificates && <p className="text-sm text-red-600 mt-2">{errors.certificates}</p>}
                      </div>

                      {/* Work Samples Upload */}
                      <div className="border rounded-lg p-4 bg-white">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Work Samples</h4>
                        <p className="text-xs text-blue-600 mb-3">Upload images or PDFs of your work samples. Max 5 files.</p>
                        <label className="w-full block">
                          <input
                            aria-label="Upload work samples"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={e => {
                              const files = Array.from(e.target.files || [])
                              if (files.length + formData.workSamples.length > 5) {
                                setErrors(prev => ({ ...prev, workSamples: "Maximum 5 files allowed." }))
                                return
                              }
                              const validFiles = files.filter(file => ["application/pdf","image/jpeg","image/png","image/webp"].includes(file.type))
                              if (validFiles.length !== files.length) {
                                setErrors(prev => ({ ...prev, workSamples: "Only PDF, JPG, PNG, WEBP allowed for work samples." }))
                                return
                              }
                              const urls = validFiles.map(file => URL.createObjectURL(file))
                              handleWorkSamplesUpload(validFiles, urls)
                            }}
                            className="w-full text-sm text-blue-600"
                          />
                        </label>
                        {previews.workSamples.length > 0 && (
                          <ul className="mt-3 text-sm text-blue-700">
                            {previews.workSamples.map((url, idx) => (
                              <li key={idx} className="flex items-center justify-between py-1 border-b last:border-b-0">
                                <a href={url} target="_blank" rel="noreferrer" className="truncate underline">{url.split('/').pop()}</a>
                                <button className="text-xs text-red-600" onClick={() => {
                                  setFormData(prev => ({ ...prev, workSamples: prev.workSamples.filter((_, i) => i !== idx) }))
                                  setPreviews(prev => ({ ...prev, workSamples: prev.workSamples.filter((_, i) => i !== idx) }))
                                }}>Remove</button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {errors.workSamples && <p className="text-sm text-red-600 mt-2">{errors.workSamples}</p>}
                      </div>

                      {/* Portfolio Upload */}
                      <div className="border rounded-lg p-4 bg-white">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Portfolio</h4>
                        <p className="text-xs text-blue-600 mb-3">Upload your portfolio items (images or PDFs). Max 10 files.</p>
                        <label className="w-full block">
                          <input
                            aria-label="Upload portfolio items"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={e => {
                              const files = Array.from(e.target.files || [])
                              if (files.length + formData.portfolio.length > 10) {
                                setErrors(prev => ({ ...prev, portfolio: "Maximum 10 files allowed." }))
                                return
                              }
                              const validFiles = files.filter(file => ["application/pdf","image/jpeg","image/png","image/webp"].includes(file.type))
                              if (validFiles.length !== files.length) {
                                setErrors(prev => ({ ...prev, portfolio: "Only PDF, JPG, PNG, WEBP allowed for portfolio." }))
                                return
                              }
                              const urls = validFiles.map(file => URL.createObjectURL(file))
                              handlePortfolioUpload(validFiles, urls)
                            }}
                            className="w-full text-sm text-blue-600"
                          />
                        </label>
                        {previews.portfolio.length > 0 && (
                          <ul className="mt-3 text-sm text-blue-700">
                            {previews.portfolio.map((url, idx) => (
                              <li key={idx} className="flex items-center justify-between py-1 border-b last:border-b-0">
                                <a href={url} target="_blank" rel="noreferrer" className="truncate underline">{url.split('/').pop()}</a>
                                <button className="text-xs text-red-600" onClick={() => {
                                  setFormData(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== idx) }))
                                  setPreviews(prev => ({ ...prev, portfolio: prev.portfolio.filter((_, i) => i !== idx) }))
                                }}>Remove</button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {errors.portfolio && <p className="text-sm text-red-600 mt-2">{errors.portfolio}</p>}
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