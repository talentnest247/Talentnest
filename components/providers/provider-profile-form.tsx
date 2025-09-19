"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Plus, 
  X, 
  Camera, 
  FileText, 
  MapPin, 
  Phone, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import type { Provider, PortfolioItem } from "@/lib/types"
import { WhatsAppService } from "@/lib/whatsapp"

interface ProviderProfileFormProps {
  provider?: Provider
  existingProfile?: Provider
  onSave?: (profile: Partial<Provider>) => void
  onSubmit?: () => void
  onCancel?: () => void
  mode?: "create" | "edit"
}

export function ProviderProfileForm({ 
  provider,
  existingProfile, 
  onSave, 
  onSubmit,
  onCancel,
  mode = "create" 
}: ProviderProfileFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileProgress, setProfileProgress] = useState(0)

  // Form state
  const [formData, setFormData] = useState<Partial<Provider>>({
    businessName: existingProfile?.businessName || "",
    description: existingProfile?.description || "",
    location: existingProfile?.location || "",
    whatsappNumber: existingProfile?.whatsappNumber || "",
    specialization: existingProfile?.specialization || [],
    experience: existingProfile?.experience || 0,
    availability: {
      isAvailable: existingProfile?.availability?.isAvailable ?? true,
      availableForWork: existingProfile?.availability?.availableForWork ?? true,
      availableForLearning: existingProfile?.availability?.availableForLearning ?? false,
      responseTime: existingProfile?.availability?.responseTime || "Usually responds within 24 hours"
    },
    pricing: {
      baseRate: existingProfile?.pricing?.baseRate || undefined,
      learningRate: existingProfile?.pricing?.learningRate || undefined,
      currency: existingProfile?.pricing?.currency || "NGN"
    },
    portfolio: existingProfile?.portfolio || []
  })

  const [newSkill, setNewSkill] = useState("")
  const [portfolioUploads, setPortfolioUploads] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate profile completion
  useEffect(() => {
    const requiredFields = [
      formData.businessName,
      formData.description,
      formData.location,
      formData.whatsappNumber,
      formData.specialization?.length,
      formData.experience !== undefined
    ]
    
    const completed = requiredFields.filter(Boolean).length
    const progress = Math.round((completed / requiredFields.length) * 100)
    setProfileProgress(progress)
  }, [formData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName?.trim()) {
      newErrors.businessName = "Business name is required"
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.whatsappNumber?.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required"
    } else if (!WhatsAppService.isValidWhatsAppNumber(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Please enter a valid WhatsApp number (e.g., +234...)"
    }

    if (!formData.specialization?.length) {
      newErrors.specialization = "At least one specialization is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.specialization?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        specialization: [...(prev.specialization || []), newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization?.filter(s => s !== skill) || []
    }))
  }

  const handlePortfolioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setPortfolioUploads(prev => [...prev, ...files])
  }

  const handleRemovePortfolioFile = (index: number) => {
    setPortfolioUploads(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // In a real implementation, you would:
      // 1. Upload portfolio files to storage
      // 2. Create/update provider profile in database
      // 3. Handle verification request if needed

      const profileData = {
        ...formData,
        id: existingProfile?.id || crypto.randomUUID(),
        userId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        role: "artisan" as const,
        rating: existingProfile?.rating || 0,
        totalReviews: existingProfile?.totalReviews || 0,
        verified: existingProfile?.verified || false,
        verificationStatus: existingProfile?.verificationStatus || "pending" as const,
        createdAt: existingProfile?.createdAt || new Date(),
        updatedAt: new Date()
      }

      console.log("Saving provider profile:", profileData)
      
      if (onSave) {
        onSave(profileData)
      } else {
        // Default behavior - redirect to profile or dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to save provider profile:", error)
      setErrors({ submit: "Failed to save profile. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          {mode === "create" ? "Create Your Provider Profile" : "Edit Provider Profile"}
        </h1>
        <p className="text-muted-foreground">
          Showcase your skills and connect with students at UNILORIN
        </p>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Profile Completion</span>
            <span>{profileProgress}%</span>
          </div>
          <Progress value={profileProgress} className="h-2" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business/Service Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="e.g., Creative Designs Studio"
                  className={errors.businessName ? "border-red-500" : ""}
                />
                {errors.businessName && (
                  <p className="text-sm text-red-500">{errors.businessName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., UNILORIN Campus, Ilorin"
                    className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your services, experience, and what makes you unique..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="whatsappNumber"
                    value={formData.whatsappNumber || ""}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      whatsappNumber: WhatsAppService.formatPhoneNumber(e.target.value)
                    }))}
                    placeholder="+234..."
                    className={`pl-10 ${errors.whatsappNumber ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.whatsappNumber && (
                  <p className="text-sm text-red-500">{errors.whatsappNumber}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  This will be used for the WhatsApp contact button
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    experience: parseInt(e.target.value) || 0 
                  }))}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Specializations *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill or specialization"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              />
              <Button type="button" onClick={handleAddSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.specialization?.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            {errors.specialization && (
              <p className="text-sm text-red-500">{errors.specialization}</p>
            )}
          </CardContent>
        </Card>

        {/* Availability & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Availability & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Currently Available for Work</Label>
                <p className="text-sm text-muted-foreground">
                  Turn off if you're not accepting new clients
                </p>
              </div>
              <Switch
                checked={formData.availability?.isAvailable ?? true}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    availability: { ...prev.availability!, isAvailable: checked }
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Available for Teaching/Training</Label>
                <p className="text-sm text-muted-foreground">
                  Show "Available for Learning" badge to attract students
                </p>
              </div>
              <Switch
                checked={formData.availability?.availableForLearning ?? false}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    availability: { ...prev.availability!, availableForLearning: checked }
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="baseRate">Base Service Rate (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="baseRate"
                    type="number"
                    min="0"
                    value={formData.pricing?.baseRate || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { 
                        ...prev.pricing!, 
                        baseRate: parseFloat(e.target.value) || undefined 
                      }
                    }))}
                    placeholder="e.g., 5000"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">NGN per service/project</p>
              </div>

              {formData.availability?.availableForLearning && (
                <div className="space-y-2">
                  <Label htmlFor="learningRate">Teaching/Training Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="learningRate"
                      type="number"
                      min="0"
                      value={formData.pricing?.learningRate || ""}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing: { 
                          ...prev.pricing!, 
                          learningRate: parseFloat(e.target.value) || undefined 
                        }
                      }))}
                      placeholder="e.g., 3000"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">NGN per session/hour</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Portfolio (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <Label htmlFor="portfolio-upload" className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80">Upload portfolio images</span>
                    <Input
                      id="portfolio-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePortfolioUpload}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    PNG, JPG up to 5MB each. Maximum 10 images.
                  </p>
                </div>
              </div>
            </div>

            {portfolioUploads.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2">
                  {portfolioUploads.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePortfolioFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        {errors.submit && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || profileProgress < 80}>
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
            {mode === "create" ? "Create Profile" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
