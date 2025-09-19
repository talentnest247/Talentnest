'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, AlertCircle, Briefcase, Plus, X, Upload } from 'lucide-react'
import { ArtisanSignupFormData } from '@/lib/types'
import { validateEmail, validatePhoneNumber } from '@/lib/validation'
import { createClient } from '@/lib/supabase/client'

const SKILL_CATEGORIES = [
  'Carpentry & Woodwork',
  'Plumbing & Water Systems',
  'Electrical Work',
  'Masonry & Construction',
  'Painting & Decoration',
  'Welding & Metal Work',
  'Tailoring & Fashion Design',
  'Hair Styling & Beauty',
  'Auto Repair & Mechanics',
  'Electronics Repair',
  'Phone & Computer Repair',
  'Catering & Food Services',
  'Photography & Videography',
  'Graphic Design & Branding',
  'Web Development & Tech',
  'Tutoring & Education',
  'Cleaning & Maintenance',
  'Event Planning & Management',
  'Agriculture & Farming',
  'Handicrafts & Arts',
  'Music & Entertainment',
  'Fitness & Sports Training',
  'Other'
]

export function ArtisanRegisterForm() {
  const [formData, setFormData] = useState<ArtisanSignupFormData>({
    email: '',
    fullName: '',
    phoneNumber: '',
    whatsappNumber: '',
    bio: '',
    experience: '',
    skills: [],
    portfolioLinks: [],
    certificates: [],
    password: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [portfolioInput, setPortfolioInput] = useState('')
  const router = useRouter()

  const validateField = (name: string, value: string | string[] | File[] | undefined) => {
    if (!value) return 'This field is required'
    
    switch (name) {
      case 'email':
        return validateEmail(value as string) ? '' : 'Please enter a valid email address'
      case 'fullName':
        return (value as string).length >= 2 ? '' : 'Full name must be at least 2 characters'
      case 'phoneNumber':
      case 'whatsappNumber':
        return validatePhoneNumber(value as string) ? '' : 'Invalid Nigerian phone number'
      case 'bio':
        return (value as string).length >= 50 ? '' : 'Bio must be at least 50 characters'
      case 'experience':
        return (value as string).length >= 30 ? '' : 'Experience description must be at least 30 characters'
      case 'skills':
        return (value as string[]).length > 0 ? '' : 'At least one skill is required'
      case 'password':
        return (value as string).length >= 8 ? '' : 'Password must be at least 8 characters'
      case 'confirmPassword':
        return (value as string) === formData.password ? '' : 'Passwords do not match'
      default:
        return ''
    }
  }

  const handleInputChange = (name: string, value: string | string[] | File[]) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      const newSkills = [...formData.skills, skillInput.trim()]
      handleInputChange('skills', newSkills)
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const newSkills = formData.skills.filter(skill => skill !== skillToRemove)
    handleInputChange('skills', newSkills)
  }

  const addPortfolioLink = () => {
    if (portfolioInput.trim() && !formData.portfolioLinks.includes(portfolioInput.trim())) {
      const newLinks = [...formData.portfolioLinks, portfolioInput.trim()]
      handleInputChange('portfolioLinks', newLinks)
      setPortfolioInput('')
    }
  }

  const removePortfolioLink = (linkToRemove: string) => {
    const newLinks = formData.portfolioLinks.filter(link => link !== linkToRemove)
    handleInputChange('portfolioLinks', newLinks)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    handleInputChange('certificates', files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    
    // Validate individual fields
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof ArtisanSignupFormData]
      const error = validateField(key, value)
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

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        throw new Error('Email already registered')
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            account_type: 'artisan',
          },
        },
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile in users table for artisan
      // Note: Artisans don't have matric_number, faculty, department, level
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          whatsapp_number: formData.whatsappNumber || formData.phoneNumber,
          bio: formData.bio,
          skills: formData.skills,
          account_type: 'artisan',
          area: 'tanke', // Default area, should be made configurable
          is_verified: false, // Artisans need admin verification
          is_admin: false,
          total_rating: 0.0,
          total_reviews: 0,
          // Note: matric_number, faculty, department, level are NULL for artisans
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Failed to create user profile: ' + profileError.message)
      }

      // Success - redirect to verification pending page
      router.push('/auth/sign-up-success?type=artisan&message=Your registration has been submitted! Please wait for admin verification.')
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
          <Briefcase className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Artisan Registration</CardTitle>
        <CardDescription>
          Join TalentNest as a verified artisan and showcase your skills to students
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
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
                <p className="text-sm text-gray-500">Students will contact you via WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                placeholder="Tell students about yourself, your background, and what makes you unique..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className={`min-h-[100px] ${errors.bio ? 'border-red-500' : ''}`}
              />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
              <p className="text-sm text-gray-500">Minimum 50 characters. This will be shown on your profile.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience & Expertise *</Label>
              <Textarea
                id="experience"
                placeholder="Describe your professional experience, previous projects, achievements, and what you specialize in..."
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className={`min-h-[120px] ${errors.experience ? 'border-red-500' : ''}`}
              />
              {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
              <p className="text-sm text-gray-500">Minimum 30 characters. Include years of experience and notable projects.</p>
            </div>
          </div>

          {/* Skills & Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Skills & Services</h3>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Your Skills *</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  type="text"
                  placeholder="Add a skill (e.g., Carpentry, Web Design)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className={errors.skills ? 'border-red-500' : ''}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        aria-label={`Remove ${skill}`}
                        title={`Remove ${skill}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {errors.skills && <p className="text-sm text-red-500">{errors.skills}</p>}
              
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Popular Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_CATEGORIES.slice(0, 8).map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!formData.skills.includes(category)) {
                          handleInputChange('skills', [...formData.skills, category])
                        }
                      }}
                      className="text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioLinks">Portfolio Links (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="portfolioLinks"
                  type="url"
                  placeholder="Add portfolio URL (e.g., website, Instagram, etc.)"
                  value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioLink())}
                />
                <Button type="button" onClick={addPortfolioLink} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.portfolioLinks.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm text-blue-600 truncate flex-1">{link}</span>
                      <button
                        type="button"
                        onClick={() => removePortfolioLink(link)}
                        className="text-red-500 hover:bg-red-100 rounded p-1"
                        aria-label={`Remove ${link}`}
                        title={`Remove ${link}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-500">Add links to showcase your work (website, social media, etc.)</p>
            </div>
          </div>

          {/* Certificates & Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Certificates & Verification</h3>
            
            <div className="space-y-2">
              <Label htmlFor="certificates">Upload Certificates *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="certificateUpload" className="cursor-pointer text-blue-600 hover:text-blue-500">
                    Choose certificate files
                  </Label>
                  <input
                    id="certificateUpload"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload certificate files"
                    title="Upload certificate files"
                  />
                  <p className="text-sm text-gray-500">Upload certificates, licenses, or other credentials</p>
                  <p className="text-xs text-gray-400">Supported: JPG, PNG, PDF (Max 5MB each)</p>
                </div>
              </div>
              
              {formData.certificates.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  {Array.from(formData.certificates).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <span className="text-sm text-green-700 flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.certificates && <p className="text-sm text-red-500">{errors.certificates}</p>}
              <p className="text-sm text-gray-500">These documents will be reviewed by our admin team for verification</p>
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

          {/* Verification Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Verification Process:</strong> Your account will be reviewed by our admin team within 2-3 business days. 
              You&apos;ll receive an email notification once your application is approved or if additional information is needed.
            </AlertDescription>
          </Alert>

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
                {' '}and understand that my application will be reviewed for verification
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg" 
            disabled={loading}
          >
            {loading ? 'Submitting Application...' : 'Submit Artisan Application'}
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
