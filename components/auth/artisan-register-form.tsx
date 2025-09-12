'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileUpload } from '@/components/upload/enhanced-file-upload'
import { toast } from 'sonner'
import { Eye, EyeOff, AlertCircle, FileText, Award, User } from 'lucide-react'
import { ArtisanSignupFormData } from '@/lib/types'

const TRADE_CATEGORIES = [
  'Carpentry',
  'Plumbing',
  'Electrical Work',
  'Masonry & Construction',
  'Painting & Decoration',
  'Welding & Metal Work',
  'Tailoring & Fashion',
  'Hair Styling & Beauty',
  'Auto Repair & Mechanics',
  'Electronics Repair',
  'Phone & Computer Repair',
  'Catering & Food Services',
  'Photography & Videography',
  'Graphic Design',
  'Web Development',
  'Tutoring & Education',
  'Cleaning Services',
  'Event Planning',
  'Agriculture & Farming',
  'Other'
]

export function ArtisanRegisterForm() {
  const [formData, setFormData] = useState<ArtisanSignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    matric_number: '',
    phone: '',
    business_name: '',
    business_registration_number: '',
    trade_category: '',
    years_of_experience: 0,
    location: '',
    description: '',
    documents: [],
    certificate: null,
    bio_document: null
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
    if (!formData.matric_number) newErrors.push('Matric number is required')
    if (!formData.password) newErrors.push('Password is required')
    if (formData.password.length < 8) newErrors.push('Password must be at least 8 characters')
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match')
    if (!formData.phone) newErrors.push('Phone number is required')
    if (!formData.business_name) newErrors.push('Business name is required')
    if (!formData.trade_category) newErrors.push('Trade category is required')
    if (!formData.years_of_experience || formData.years_of_experience < 0) newErrors.push('Years of experience is required')
    if (!formData.location) newErrors.push('Location is required')
    if (!formData.description) newErrors.push('Business description is required')
    if (formData.documents.length === 0) newErrors.push('At least one supporting document is required')
    if (!formData.certificate) newErrors.push('Certificate is required')
    if (!formData.bio_document) newErrors.push('Bio document is required')

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Prepare data for API
      const registrationData = {
        firstName: formData.full_name.split(' ')[0] || formData.full_name,
        lastName: formData.full_name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'artisan',
        businessName: formData.business_name,
        specialization: formData.trade_category,
        experience: formData.years_of_experience,
        location: formData.location
      }

      console.log('Artisan registration data being sent:', registrationData)

      // Call the registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      })

      const result = await response.json()
      console.log('Artisan registration API response:', { response: response.status, result })

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      toast.success('Registration successful! You can now log in.')
      router.push('/login?message=Registration successful - you can now log in')
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, documents: files }))
  }

  const handleCertificateChange = (files: File[]) => {
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, certificate: files[0] }))
    }
  }

  const handleBioDocumentChange = (files: File[]) => {
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, bio_document: files[0] }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Artisan Registration</CardTitle>
        <CardDescription>
          Register as an artisan student to offer your skills and services to the university community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matric_number">Matric Number *</Label>
                <Input
                  id="matric_number"
                  type="text"
                  value={formData.matric_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, matric_number: e.target.value }))}
                  placeholder="e.g., 19/55HA001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter any email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_registration_number">Business Registration Number</Label>
                <Input
                  id="business_registration_number"
                  type="text"
                  value={formData.business_registration_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_registration_number: e.target.value }))}
                  placeholder="Enter registration number (if applicable)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trade_category">Trade Category *</Label>
                <Select 
                  value={formData.trade_category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, trade_category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your trade category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_of_experience">Years of Experience *</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  min="0"
                  value={formData.years_of_experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter years of experience"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter your business location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your business and services..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Documents</h3>
            
            {/* Certificate Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certificate *
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload your professional certificate or qualification document
              </p>
              <FileUpload
                files={formData.certificate ? [formData.certificate] : []}
                onFilesChange={handleCertificateChange}
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
                acceptedTypes={['application/pdf', 'image/png', 'image/jpg', 'image/jpeg']}
              />
              {formData.certificate && (
                <p className="text-sm text-green-600">
                  Certificate uploaded: {formData.certificate.name}
                </p>
              )}
            </div>

            {/* Bio Document Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Bio Document *
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload a document containing your professional biography and portfolio
              </p>
              <FileUpload
                files={formData.bio_document ? [formData.bio_document] : []}
                onFilesChange={handleBioDocumentChange}
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
                acceptedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
              />
              {formData.bio_document && (
                <p className="text-sm text-green-600">
                  Bio document uploaded: {formData.bio_document.name}
                </p>
              )}
            </div>

            {/* Supporting Documents Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Supporting Documents *
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload additional supporting documents (ID card, work samples, references, etc.)
              </p>
              <FileUpload
                files={formData.documents}
                onFilesChange={handleFileChange}
                maxFiles={5}
                maxSize={5 * 1024 * 1024}
                acceptedTypes={['application/pdf', 'image/png', 'image/jpg', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
              />
              {formData.documents.length > 0 && (
                <div className="text-sm text-green-600">
                  {formData.documents.length} supporting document(s) uploaded
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Artisan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
