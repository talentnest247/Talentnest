'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, AlertCircle, User } from 'lucide-react'
import { StudentSignupFormData } from '@/lib/types'
import { validateEmail, validateMatricNumber, validatePhoneNumber } from '@/lib/validation'

const FACULTIES = [
  'Faculty of Agriculture',
  'Faculty of Arts',
  'Faculty of Basic Medical Sciences',
  'Faculty of Clinical Sciences',
  'Faculty of Communication and Information Sciences',
  'Faculty of Education',
  'Faculty of Engineering and Technology',
  'Faculty of Environmental Sciences',
  'Faculty of Law',
  'Faculty of Life Sciences',
  'Faculty of Management Sciences',
  'Faculty of Pharmaceutical Sciences',
  'Faculty of Physical Sciences',
  'Faculty of Social Sciences',
  'Faculty of Veterinary Medicine'
]

const DEPARTMENTS = {
  'Faculty of Agriculture': ['Agricultural Economics and Farm Management', 'Agricultural Extension and Rural Development', 'Animal Production', 'Crop Production', 'Soil Science and Agricultural Physics'],
  'Faculty of Arts': ['Arabic', 'English', 'French', 'History and International Studies', 'Linguistics and Nigerian Languages', 'Music', 'Philosophy', 'Religious Studies'],
  'Faculty of Basic Medical Sciences': ['Anatomy', 'Medical Biochemistry', 'Medical Microbiology and Parasitology', 'Pharmacology and Therapeutics', 'Physiology'],
  'Faculty of Clinical Sciences': ['Anaesthesia and Intensive Care', 'Chemical Pathology', 'Community Medicine', 'Dermatology and Venereology', 'Haematology and Blood Transfusion', 'Medicine', 'Obstetrics and Gynaecology', 'Ophthalmology', 'Orthopaedics and Traumatology', 'Otorhinolaryngology', 'Paediatrics and Child Health', 'Pathology', 'Psychiatry', 'Radiology', 'Surgery'],
  'Faculty of Communication and Information Sciences': ['Computer Science', 'Information and Communication Science', 'Library and Information Science', 'Mass Communication', 'Telecommunication Science'],
  'Faculty of Education': ['Adult Education and Community Development', 'Arts and Social Sciences Education', 'Counsellor Education', 'Educational Management', 'Educational Technology', 'Human Kinetics Education', 'Science Education'],
  'Faculty of Engineering and Technology': ['Agricultural and Biosystems Engineering', 'Chemical Engineering', 'Civil Engineering', 'Computer Engineering', 'Electrical and Electronics Engineering', 'Food Science and Technology', 'Materials and Metallurgical Engineering', 'Mechanical Engineering'],
  'Faculty of Environmental Sciences': ['Architecture', 'Building', 'Estate Management', 'Quantity Surveying', 'Urban and Regional Planning'],
  'Faculty of Law': ['Private and Property Law', 'Public Law'],
  'Faculty of Life Sciences': ['Biochemistry', 'Industrial Chemistry', 'Microbiology', 'Plant Biology', 'Zoology'],
  'Faculty of Management Sciences': ['Accounting', 'Banking and Finance', 'Business Administration', 'Industrial Relations and Personnel Management', 'Insurance', 'Marketing'],
  'Faculty of Pharmaceutical Sciences': ['Clinical Pharmacy and Pharmacy Practice', 'Pharmaceutical and Medicinal Chemistry', 'Pharmaceutical Microbiology', 'Pharmaceutics and Pharmaceutical Technology', 'Pharmacognosy and Drug Development', 'Pharmacology and Toxicology'],
  'Faculty of Physical Sciences': ['Chemistry', 'Geology and Mineral Sciences', 'Mathematics', 'Physics', 'Statistics'],
  'Faculty of Social Sciences': ['Demography and Social Statistics', 'Economics', 'Geography and Environmental Management', 'Political Science', 'Psychology', 'Sociology'],
  'Faculty of Veterinary Medicine': ['Veterinary Anatomy', 'Veterinary Medicine', 'Veterinary Microbiology and Parasitology', 'Veterinary Pathology', 'Veterinary Pharmacology and Toxicology', 'Veterinary Physiology and Biochemistry', 'Veterinary Public Health and Preventive Medicine', 'Veterinary Surgery and Radiology']
}

const LEVELS = ['100', '200', '300', '400', '500', '600']

export function StudentRegisterForm() {
  const [formData, setFormData] = useState<StudentSignupFormData>({
    email: '',
    fullName: '',
    matricNumber: '',
    phoneNumber: '',
    whatsappNumber: '',
    faculty: '',
    department: '',
    level: '',
    state: '',
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
        return validateEmail(value) ? '' : 'Please enter a valid email address'
      case 'fullName':
        return value.length >= 2 ? '' : 'Full name must be at least 2 characters'
      case 'matricNumber':
        return validateMatricNumber(value) ? '' : 'Invalid matric number format (e.g., 20-52hl077)'
      case 'phoneNumber':
      case 'whatsappNumber':
        return validatePhoneNumber(value) ? '' : 'Invalid Nigerian phone number'
      case 'password':
        return value.length >= 8 ? '' : 'Password must be at least 8 characters'
      case 'confirmPassword':
        return value === formData.password ? '' : 'Passwords do not match'
      case 'faculty':
      case 'department':
      case 'level':
        return value ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
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
      const value = formData[key as keyof StudentSignupFormData]
      const error = validateField(key, typeof value === 'string' ? value : '')
      if (error) newErrors[key] = error
    })

    if (!termsAccepted) {
      newErrors.terms = 'Please accept the terms and conditions'
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          accountType: 'student'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Success - redirect to login with success message
      router.push('/login?message=Registration successful! Please sign in with your credentials.')
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const selectedDepartments = formData.faculty ? DEPARTMENTS[formData.faculty as keyof typeof DEPARTMENTS] || [] : []

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Student Registration</CardTitle>
        <CardDescription>
          Create your student account to access all TalentNest features
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricNumber">Matriculation Number *</Label>
              <Input
                id="matricNumber"
                type="text"
                placeholder="e.g., 20-52hl077"
                value={formData.matricNumber}
                onChange={(e) => handleInputChange('matricNumber', e.target.value.toUpperCase())}
                className={errors.matricNumber ? 'border-red-500' : ''}
              />
              {errors.matricNumber && <p className="text-sm text-red-500">{errors.matricNumber}</p>}
              <p className="text-sm text-gray-500">Enter your UNILORIN matriculation number</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  className={errors.whatsappNumber ? 'border-red-500' : ''}
                />
                {errors.whatsappNumber && <p className="text-sm text-red-500">{errors.whatsappNumber}</p>}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty *</Label>
              <Select 
                value={formData.faculty} 
                onValueChange={(value) => {
                  handleInputChange('faculty', value)
                  handleInputChange('department', '') // Reset department when faculty changes
                }}
              >
                <SelectTrigger className={errors.faculty ? 'border-red-500' : ''}>
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
              {errors.faculty && <p className="text-sm text-red-500">{errors.faculty}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleInputChange('department', value)}
                disabled={!formData.faculty}
              >
                <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepartments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Current Level *</Label>
              <Select 
                value={formData.level} 
                onValueChange={(value) => handleInputChange('level', value)}
              >
                <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level} Level
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
            </div>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <button type="button" className="text-blue-600 hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-blue-600 hover:underline">
                  Privacy Policy
                </button>
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
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
  )
}
