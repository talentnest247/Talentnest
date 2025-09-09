'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { User, Users, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface RoleCompletionData {
  role: 'student' | 'artisan' | ''
  phone: string
  
  // Student fields
  studentId: string
  department: string
  level: string
  
  // Artisan fields
  businessName: string
  specialization: string
  experience: string
  location: string
}

// Same options as in the main registration form
const departments = [
  "Computer Science", "Engineering", "Medicine", "Law", "Business Administration",
  "Economics", "Psychology", "Biology", "Chemistry", "Physics", "Mathematics",
  "English Language", "History", "Political Science", "Sociology", "Philosophy",
  "Fine Arts", "Music", "Theatre Arts", "Architecture", "Agriculture", "Other"
]

const academicLevels = ["100", "200", "300", "400", "500", "Masters", "PhD"]

const specializations = [
  "Fashion Design", "Tailoring", "Shoe Making", "Bag Making", "Hair Styling", 
  "Makeup Artistry", "Nail Art", "Jewelry Making", "Textile Design",
  "Pottery", "Sculpture", "Painting", "Drawing", "Woodworking", "Metalwork",
  "Leatherwork", "Beadwork", "Embroidery", "Photography",
  "Web Development", "Mobile App Development", "Graphic Design", "Video Editing",
  "Digital Marketing", "Content Creation", "UI/UX Design",
  "Catering", "Baking", "Pastry Making", "Food Photography", "Nutrition Consulting",
  "Tutoring", "Music Instruction", "Dance Instruction", "Event Planning",
  "Home Repairs", "Cleaning Services", "Other"
]

const experienceLevels = [
  "1 year", "2 years", "3 years", "4 years", "5 years", 
  "6 years", "7 years", "8 years", "9 years", "10+ years"
]

const locations = [
  "Ilorin South", "Ilorin West", "Ilorin East", "Asa", "Moro",
  "University of Ilorin", "Kwara State Polytechnic", "Online Services",
  "Mobile Services (Travel to Client)", "Other"
]

export default function CompleteRegistrationPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<RoleCompletionData>({
    role: '',
    phone: '',
    studentId: '',
    department: '',
    level: '',
    businessName: '',
    specialization: '',
    experience: '',
    location: ''
  })

  // Check if user is authenticated and get their info
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.error('No authenticated user:', error)
          router.push('/login?error=not_authenticated')
          return
        }

        // Check if user already completed registration
        const { data: existingProfile, error: profileError } = await supabase
          .from('users')
          .select('role, email, full_name')
          .eq('id', user.id)
          .single()

        if (!profileError && existingProfile) {
          console.log('User already has profile, redirecting to dashboard')
          router.push('/dashboard')
          return
        }

        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
        router.push('/login?error=check_failed')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [supabase, router])

  const handleInputChange = (field: keyof RoleCompletionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.role) newErrors.role = "Please select your role"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"

    // Role-specific validation
    if (formData.role === 'student') {
      if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required"
      if (!formData.department) newErrors.department = "Department is required"
      if (!formData.level) newErrors.level = "Academic level is required"
    }

    if (formData.role === 'artisan') {
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
      if (!formData.specialization) newErrors.specialization = "Specialization is required"
      if (!formData.experience) newErrors.experience = "Experience level is required"
      if (!formData.location) newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setIsSubmitting(true)

    try {
      // Prepare user data for database
      const userData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        first_name: user.user_metadata?.given_name || '',
        last_name: user.user_metadata?.family_name || '',
        phone: formData.phone,
        role: formData.role,
        email_verified: user.email_confirmed_at ? true : false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Role-specific fields
        ...(formData.role === 'student' && {
          student_id: formData.studentId,
          department: formData.department,
          academic_level: formData.level,
        }),
        ...(formData.role === 'artisan' && {
          business_name: formData.businessName,
          specialization: formData.specialization,
          experience_level: formData.experience,
          service_location: formData.location,
        })
      }

      // Insert user profile
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert([userData])
        .select('id, role, email')
        .single()

      if (insertError) {
        console.error('Profile creation error:', insertError)
        
        if (insertError.code === '23505') {
          if (insertError.message.includes('student_id')) {
            setErrors({ studentId: 'Student ID already registered' })
          } else {
            setErrors({ submit: 'Account already exists' })
          }
        } else {
          setErrors({ submit: 'Failed to complete registration. Please try again.' })
        }
        return
      }

      console.log('Profile created successfully:', newProfile)
      router.push('/dashboard')

    } catch (error) {
      console.error('Registration completion error:', error)
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-purple-900/5 to-pink-900/5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-xl"></div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-blue-900 via-purple-700 to-pink-800 bg-clip-text text-transparent mb-2">
                TalentNest
              </h1>
            </Link>
            <p className="text-gray-600 text-lg">
              Complete Your Registration
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-3xl font-serif text-gray-900">Almost Done!</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Welcome {user?.user_metadata?.full_name || user?.email}! <br />
                Please select your role to complete your registration.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {errors.submit && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errors.submit}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Phone Number (required for all) */}
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

                {/* Student-Specific Fields */}
                {formData.role === 'student' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 flex items-center">
                      <Badge className="mr-2 bg-blue-600">Student</Badge>
                      Academic Information
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID/Matric Number *</Label>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department *</Label>
                          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                            <SelectTrigger className={`h-11 ${errors.department ? 'border-red-300' : ''}`}>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level">Academic Level *</Label>
                          <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                            <SelectTrigger className={`h-11 ${errors.level ? 'border-red-300' : ''}`}>
                              <SelectValue placeholder="Select level" />
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
                    </div>
                  </div>
                )}

                {/* Artisan-Specific Fields */}
                {formData.role === 'artisan' && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 flex items-center">
                      <Badge className="mr-2 bg-purple-600">Artisan</Badge>
                      Professional Information
                    </h4>
                    
                    <div className="space-y-4">
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
                              <SelectValue placeholder="Your specialty" />
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
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting || !formData.role}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Completing Registration...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
