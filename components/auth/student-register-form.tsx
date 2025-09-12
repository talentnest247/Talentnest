'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { StudentSignupFormData } from '@/lib/types'

const FACULTIES = [
  'Agriculture',
  'Arts',
  'Basic Clinical Sciences',
  'Basic Medical Sciences',
  'Clinical Sciences',
  'Communication and Information Sciences',
  'Education',
  'Engineering and Technology',
  'Environmental Sciences',
  'Law',
  'Life Sciences',
  'Management Sciences',
  'Pharmaceutical Sciences',
  'Physical Sciences',
  'Social Sciences',
  'Veterinary Medicine'
]

const LEVELS = ['100', '200', '300', '400', '500', '600']

export function StudentRegisterForm() {
  const [formData, setFormData] = useState<StudentSignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    matric_number: '',
    faculty: '',
    department: '',
    level: '',
    field_of_study: '',
    year_of_study: undefined,
    school: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!formData.email) newErrors.push('Email is required')
    if (!formData.full_name) newErrors.push('Full name is required')
    if (!formData.password) newErrors.push('Password is required')
    if (formData.password.length < 8) newErrors.push('Password must be at least 8 characters')
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match')
    if (!formData.phone) newErrors.push('Phone number is required')
    if (!formData.matric_number) newErrors.push('Matriculation number is required')
    if (!formData.faculty) newErrors.push('Faculty is required')
    if (!formData.department) newErrors.push('Department is required')
    if (!formData.level) newErrors.push('Level is required')

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      console.log('Starting registration process...')
      console.log('Form data:', { 
        email: formData.email,
        full_name: formData.full_name,
        matric_number: formData.matric_number,
        faculty: formData.faculty
      })

      // Prepare data for API - map our fields to the API's expected fields
      const registrationData = {
        firstName: formData.full_name.split(' ')[0] || formData.full_name,
        lastName: formData.full_name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'student',
        studentId: formData.matric_number,
        department: formData.department,
        level: formData.level
      }

      console.log('Registration data being sent:', registrationData)

      // Call the registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      })

      const result = await response.json()
      console.log('Registration API response:', { response: response.status, result })

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      console.log('Registration successful!')
      toast.success('Registration successful! You can now log in.')
      router.push('/login?message=Registration successful - you can now log in')
    } catch (error: unknown) {
      console.error('Registration error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      toast.error(`Registration failed: ${errorMessage}`)
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('email')) {
          toast.error('Email is already registered or invalid')
        } else if (error.message.includes('matric')) {
          toast.error('Matriculation number is already in use')
        } else if (error.message.includes('password')) {
          toast.error('Password requirements not met')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>Create your student account to connect with artisans</CardDescription>
      </CardHeader>
      <CardContent>
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter any email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Academic Information (Optional) */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Academic Information <span className="text-sm font-normal text-muted-foreground">(Optional)</span></h3>
            
            <div className="space-y-2">
              <Label htmlFor="matric_number">Matric Number</Label>
              <Input
                id="matric_number"
                value={formData.matric_number}
                onChange={(e) => setFormData({ ...formData, matric_number: e.target.value })}
                placeholder="e.g., 19/1234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School/Institution</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="University of Ilorin"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Select value={formData.faculty} onValueChange={(value) => setFormData({ ...formData, faculty: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
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
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_of_study">Field of Study</Label>
              <Input
                id="field_of_study"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                placeholder="e.g., Software Engineering"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_of_study">Year of Study</Label>
              <Input
                id="year_of_study"
                type="number"
                min="1"
                max="8"
                value={formData.year_of_study || ''}
                onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="e.g., 3"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Account Security</h3>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  required
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
