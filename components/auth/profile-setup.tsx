'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { GraduationCap, User2, CheckCircle } from 'lucide-react'

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
  }
}

interface ProfileSetupProps {
  user: User
  onProfileCreated: () => void
}

const FACULTIES = [
  'Faculty of Agriculture',
  'Faculty of Arts', 
  'Faculty of Basic Medical Sciences',
  'Faculty of Clinical Medicine',
  'Faculty of Communication and Information Sciences',
  'Faculty of Education',
  'Faculty of Engineering and Technology',
  'Faculty of Environmental Sciences',
  'Faculty of Law',
  'Faculty of Life Sciences',
  'Faculty of Management Sciences',
  'Faculty of Physical Sciences',
  'Faculty of Social Sciences',
  'Faculty of Veterinary Medicine'
]

const USER_TYPES = [
  { value: 'student', label: 'Student', description: 'Looking for services and opportunities' },
  { value: 'artisan', label: 'Artisan/Service Provider', description: 'Offering skills and services' }
]

export function ProfileSetup({ user, onProfileCreated }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    matric_number: '',
    faculty: '',
    department: '',
    level: '',
    phone_number: '',
    whatsapp_number: '',
    bio: '',
    user_type: 'student'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.full_name && formData.user_type
      case 2:
        if (formData.user_type === 'student') {
          return formData.matric_number && formData.faculty && formData.level
        }
        return formData.faculty && formData.department
      case 3:
        return formData.phone_number
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    } else {
      setError('Please fill in all required fields')
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const profileData = {
        id: user.id,
        email: user.email,
        full_name: formData.full_name,
        matric_number: formData.matric_number || null,
        faculty: formData.faculty,
        department: formData.department || null,
        level: formData.level || null,
        phone_number: formData.phone_number,
        whatsapp_number: formData.whatsapp_number || formData.phone_number,
        bio: formData.bio || null,
        user_type: formData.user_type,
        is_verified: false,
        total_rating: 0,
        total_reviews: 0,
        account_type: formData.user_type, // Add this field for consistency
        created_at: new Date().toISOString()
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert(profileData)

      if (insertError) {
        throw insertError
      }

      toast({
        title: "Profile Created Successfully!",
        description: "Welcome to TalentNest. Your profile has been set up.",
      })

      setIsSuccess(true)
      
      // Wait a moment to show success state, then call onProfileCreated
      setTimeout(() => {
        onProfileCreated()
      }, 1500)

    } catch (error: unknown) {
      console.error('Profile creation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile. Please try again.'
      setError(errorMessage)
      toast({
        title: "Profile Creation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Created!</h2>
            <p className="text-gray-600 mb-6">
              Welcome to TalentNest. Your profile has been successfully set up.
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-6 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-lg border-2 border-green-100">
              <Image 
                src="/unilorin-logo.jpg" 
                alt="University of Ilorin" 
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                TalentNest
              </h1>
              <span className="text-sm text-gray-500 font-medium">UNILORIN Community</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">
            We need a few details to set up your profile and get you started on TalentNest
          </p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-center">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Academic Details'}
              {currentStep === 3 && 'Contact Information'}
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === 1 && 'Tell us about yourself'}
              {currentStep === 2 && 'Your academic information'}
              {currentStep === 3 && 'How can we reach you?'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Account Type *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {USER_TYPES.map((type) => (
                      <div
                        key={type.value}
                        onClick={() => handleInputChange('user_type', type.value)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.user_type === type.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {type.value === 'student' ? <GraduationCap className="w-5 h-5 mr-2" /> : <User2 className="w-5 h-5 mr-2" />}
                          <span className="font-semibold">{type.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {formData.user_type === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="matric_number" className="text-sm font-medium text-gray-700">
                      Matriculation Number *
                    </Label>
                    <Input
                      id="matric_number"
                      type="text"
                      placeholder="e.g., 18/55HA001"
                      value={formData.matric_number}
                      onChange={(e) => handleInputChange('matric_number', e.target.value.toUpperCase())}
                      className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="faculty" className="text-sm font-medium text-gray-700">
                    Faculty *
                  </Label>
                  <Select value={formData.faculty} onValueChange={(value) => handleInputChange('faculty', value)}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department {formData.user_type === 'artisan' && '*'}
                  </Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Enter your department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>

                {formData.user_type === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="level" className="text-sm font-medium text-gray-700">
                      Level *
                    </Label>
                    <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                        <SelectItem value="500">500 Level</SelectItem>
                        <SelectItem value="600">600 Level</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="e.g., +234 803 123 4567"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number" className="text-sm font-medium text-gray-700">
                    WhatsApp Number (Optional)
                  </Label>
                  <Input
                    id="whatsapp_number"
                    type="tel"
                    placeholder="Leave empty to use phone number"
                    value={formData.whatsapp_number}
                    onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Brief Bio (Optional)
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a bit about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="min-h-[100px] border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-8 py-3 border-2 border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !validateStep(3)}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isLoading ? 'Creating Profile...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}