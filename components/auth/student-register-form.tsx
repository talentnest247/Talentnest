"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, User, BookOpen, AlertCircle } from "lucide-react"
import { validateEmail, validatePhoneNumber } from "@/lib/validation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface StudentSignupFormData {
  email: string
  fullName: string
  phoneNumber: string
  whatsappNumber: string
  faculty: string
  department: string
  level: string
  matricNumber: string
  password: string
  confirmPassword: string
}

const FACULTIES = [
  'Agriculture',
  'Arts',
  'Basic Medical Sciences',
  'Clinical Sciences',
  'Communication and Information Sciences',
  'Education',
  'Engineering and Technology',
  'Environmental Sciences',
  'Law',
  'Life Sciences',
  'Management Sciences',
  'Pharmacy',
  'Physical Sciences',
  'Social Sciences',
  'Veterinary Medicine'
]

const DEPARTMENTS = {
  'Agriculture': [
    'Agricultural Economics and Farm Management',
    'Agricultural Extension and Rural Development',
    'Agronomy',
    'Animal Production',
    'Crop Protection',
    'Soil Science and Land Resources Management'
  ],
  'Arts': [
    'Arabic',
    'English',
    'Fine Arts',
    'French',
    'History and International Studies',
    'Linguistics and Nigerian Languages',
    'Music',
    'Performing Arts',
    'Philosophy',
    'Religious Studies'
  ],
  'Basic Medical Sciences': [
    'Anatomy',
    'Chemical Pathology',
    'Haematology and Blood Transfusion',
    'Medical Microbiology and Parasitology',
    'Morbid Anatomy',
    'Pharmacology and Therapeutics',
    'Physiology'
  ],
  'Clinical Sciences': [
    'Anaesthesia',
    'Chemical Pathology',
    'Community Medicine',
    'Dermatology',
    'Medicine',
    'Obstetrics and Gynaecology',
    'Ophthalmology',
    'Otorhinolaryngology',
    'Paediatrics and Child Health',
    'Psychiatry',
    'Radiology',
    'Surgery'
  ],
  'Communication and Information Sciences': [
    'Computer Science',
    'Information and Communication Science',
    'Library and Information Science',
    'Mass Communication',
    'Telecommunication Science'
  ],
  'Education': [
    'Arts and Social Sciences Education',
    'Counsellor Education',
    'Educational Management',
    'Educational Technology',
    'Science Education'
  ],
  'Engineering and Technology': [
    'Agricultural and Biosystems Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Engineering',
    'Electrical and Electronics Engineering',
    'Food Science and Technology',
    'Materials and Metallurgical Engineering',
    'Mechanical Engineering'
  ],
  'Environmental Sciences': [
    'Architecture',
    'Estate Management',
    'Quantity Surveying',
    'Surveying and Geoinformatics',
    'Urban and Regional Planning'
  ],
  'Law': [
    'Common and Islamic Law',
    'Jurisprudence and International Law',
    'Private and Property Law',
    'Public Law'
  ],
  'Life Sciences': [
    'Biochemistry',
    'Botany',
    'Industrial Chemistry',
    'Microbiology',
    'Plant Biology',
    'Pure and Applied Biology',
    'Zoology'
  ],
  'Management Sciences': [
    'Accounting',
    'Business Administration',
    'Finance',
    'Insurance',
    'Marketing'
  ],
  'Pharmacy': [
    'Clinical Pharmacy and Pharmacy Administration',
    'Pharmaceutical Chemistry',
    'Pharmaceutics',
    'Pharmacognosy'
  ],
  'Physical Sciences': [
    'Chemistry',
    'Geology and Mineral Sciences',
    'Mathematics',
    'Physics',
    'Statistics'
  ],
  'Social Sciences': [
    'Anthropology',
    'Economics',
    'Geography and Environmental Management',
    'Political Science',
    'Psychology',
    'Sociology'
  ],
  'Veterinary Medicine': [
    'Veterinary Anatomy',
    'Veterinary Medicine',
    'Veterinary Microbiology',
    'Veterinary Parasitology and Entomology',
    'Veterinary Pathology',
    'Veterinary Pharmacology and Toxicology',
    'Veterinary Physiology and Biochemistry',
    'Veterinary Public Health and Preventive Medicine',
    'Veterinary Surgery and Reproduction'
  ]
}

const LEVELS = [
  '100L',
  '200L', 
  '300L',
  '400L',
  '500L',
  '600L'
]

export function StudentRegisterForm() {
  const [formData, setFormData] = useState<StudentSignupFormData>({
    email: '',
    fullName: '',
    phoneNumber: '',
    whatsappNumber: '',
    faculty: '',
    department: '',
    level: '',
    matricNumber: '',
    password: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required'
        return validateEmail(value) ? '' : 'Please enter a valid email address'
      case 'fullName':
        if (!value) return 'Full name is required'
        return value.length >= 2 ? '' : 'Full name must be at least 2 characters'
      case 'phoneNumber':
      case 'whatsappNumber':
        if (!value) return 'Phone number is required'
        return validatePhoneNumber(value) ? '' : 'Invalid Nigerian phone number'
      case 'faculty':
        return value ? '' : 'Please select your faculty'
      case 'department':
        return value ? '' : 'Please select your department'
      case 'level':
        return value ? '' : 'Please select your level'
      case 'matricNumber':
        if (!value) return 'Matric number is required'
        return value.length >= 6 ? '' : 'Please enter a valid matric number'
      case 'password':
        if (!value) return 'Password is required'
        return value.length >= 8 ? '' : 'Password must be at least 8 characters'
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        return value === formData.password ? '' : 'Passwords do not match'
      default:
        return ''
    }
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof StudentSignupFormData])
      if (error) newErrors[key] = error
    })

    if (!termsAccepted) {
      newErrors.terms = 'Please accept the terms and conditions'
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)

    try {
      const supabase = createClient()

      // Check if user already exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, matric_number, email')
        .or(`matric_number.eq.${formData.matricNumber},email.eq.${formData.email}`)
        .single()

      if (existingUser) {
        if (existingUser.matric_number === formData.matricNumber) {
          throw new Error('Matric number already registered')
        }
        if (existingUser.email === formData.email) {
          throw new Error('Email already registered')
        }
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            matric_number: formData.matricNumber,
          },
        },
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          matric_number: formData.matricNumber,
          email: formData.email,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          whatsapp_number: formData.whatsappNumber || formData.phoneNumber,
          faculty: formData.faculty.toLowerCase().replace(/\s+/g, '_'),
          department: formData.department,
          level: formData.level,
          bio: '',
          skills: [],
          account_type: 'student',
          is_verified: false,
          is_admin: false,
          total_rating: 0.0,
          total_reviews: 0,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Failed to create user profile')
      }

      // Success - redirect to verification page
      router.push('/auth/sign-up-success?type=student')
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const selectedDepartments = formData.faculty ? DEPARTMENTS[formData.faculty as keyof typeof DEPARTMENTS] || [] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="mx-auto mb-4 p-4 bg-white/20 rounded-full w-fit">
              <User className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Student Registration</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Join the UNILORIN student community and discover amazing services
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {errors.submit && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`mt-2 ${errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.fullName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`mt-2 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="yourname@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`mt-2 ${errors.phoneNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="080XXXXXXXX"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="whatsappNumber" className="text-gray-700 font-medium">WhatsApp Number *</Label>
                    <Input
                      id="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      className={`mt-2 ${errors.whatsappNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="080XXXXXXXX"
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.whatsappNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Academic Information</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="faculty" className="text-gray-700 font-medium">Faculty *</Label>
                    <Select 
                      value={formData.faculty} 
                      onValueChange={(value) => {
                        handleInputChange('faculty', value)
                        handleInputChange('department', '') // Reset department when faculty changes
                      }}
                    >
                      <SelectTrigger className={`mt-2 ${errors.faculty ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                        <SelectValue placeholder="Select your faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {FACULTIES.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.faculty && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.faculty}</p>}
                  </div>

                  <div>
                    <Label htmlFor="department" className="text-gray-700 font-medium">Department *</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => handleInputChange('department', value)}
                      disabled={!formData.faculty}
                    >
                      <SelectTrigger className={`mt-2 ${errors.department ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                        <SelectValue placeholder={formData.faculty ? "Select your department" : "Select faculty first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDepartments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.department}</p>}
                  </div>

                  <div>
                    <Label htmlFor="level" className="text-gray-700 font-medium">Level *</Label>
                    <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                      <SelectTrigger className={`mt-2 ${errors.level ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.level && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.level}</p>}
                  </div>

                  <div>
                    <Label htmlFor="matricNumber" className="text-gray-700 font-medium">Matric Number *</Label>
                    <Input
                      id="matricNumber"
                      value={formData.matricNumber}
                      onChange={(e) => handleInputChange('matricNumber', e.target.value)}
                      className={`mt-2 ${errors.matricNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="e.g., 17/123456"
                    />
                    {errors.matricNumber && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.matricNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Security</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password *</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pr-10 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password *</Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="space-y-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Student Account"}
                </Button>
              </div>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-blue-600 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
