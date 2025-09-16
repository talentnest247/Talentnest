"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { getCurrentUser, getServices, saveService, getCurrentTimestamp } from "@/lib/storage"
import type { User, Service } from "@/lib/types"
import { ArrowLeft, Plus, X, Save, AlertCircle } from "lucide-react"
import Link from "next/link"

const SERVICE_CATEGORIES = [
  "Design & Creative",
  "Technology & Programming", 
  "Content & Writing",
  "Marketing & Business",
  "Photography & Video",
  "Music & Audio",
  "Education & Training",
  "Personal Services"
]

const SUBCATEGORIES: Record<string, string[]> = {
  "Design & Creative": ["Graphic Design", "UI/UX Design", "Logo Design", "Brand Identity", "Web Design"],
  "Technology & Programming": ["Web Development", "Mobile App Development", "Database Management", "API Development"],
  "Content & Writing": ["Content Writing", "Copywriting", "Technical Writing", "Blog Writing", "SEO Writing"],
  "Marketing & Business": ["Digital Marketing", "Social Media Marketing", "SEO", "Market Research", "Business Planning"],
  "Photography & Video": ["Portrait Photography", "Event Photography", "Video Production", "Photo Editing"],
  "Music & Audio": ["Music Production", "Audio Editing", "Sound Design", "Voiceover"],
  "Education & Training": ["Tutoring", "Online Teaching", "Course Creation", "Language Teaching"],
  "Personal Services": ["Event Planning", "Virtual Assistant", "Data Entry", "Administrative Support"]
}

const PRICE_RANGES = [
  "₦1,000 - ₦5,000",
  "₦5,000 - ₦10,000", 
  "₦10,000 - ₦25,000",
  "₦25,000 - ₦50,000",
  "₦50,000 - ₦100,000",
  "₦100,000+"
]

const DELIVERY_TIMES = [
  "24 hours",
  "3 days",
  "1 week", 
  "2 weeks",
  "1 month",
  "2+ months"
]

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  
  const [user, setUser] = useState<User | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    priceRange: "",
    deliveryTime: "",
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.accountType !== "artisan") {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)

    // Load the service
    const allServices = getServices()
    const foundService = allServices.find(s => s.id === serviceId && s.userId === currentUser.id)
    
    if (!foundService) {
      router.push("/dashboard/services")
      return
    }

    setService(foundService)
    setFormData({
      title: foundService.title,
      description: foundService.description,
      category: foundService.category,
      subcategory: foundService.subcategory || "",
      priceRange: foundService.priceRange,
      deliveryTime: foundService.deliveryTime,
    })
    setTags(foundService.tags)
    setLoading(false)
  }, [router, serviceId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Service title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Service description is required"
    }
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    if (!formData.priceRange) {
      newErrors.priceRange = "Price range is required"
    }
    if (!formData.deliveryTime) {
      newErrors.deliveryTime = "Delivery time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user || !service) {
      return
    }

    setIsLoading(true)

    try {
      const updatedService: Service = {
        ...service,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        priceRange: formData.priceRange,
        deliveryTime: formData.deliveryTime,
        tags,
        updatedAt: getCurrentTimestamp(),
      }

      saveService(updatedService)
      router.push("/dashboard/services")
    } catch (error) {
      console.error("Error updating service:", error)
      setErrors({ submit: "Failed to update service. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service...</p>
        </div>
      </div>
    )
  }

  if (!user || !service) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/services">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Service</h1>
          <p className="text-muted-foreground">
            Update your service details and information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Professional Logo Design for Your Business"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your service in detail. What will you deliver? What makes your service unique?"
                  rows={6}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Category & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select 
                    value={formData.subcategory} 
                    onValueChange={(value) => handleInputChange("subcategory", value)}
                    disabled={!formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category && SUBCATEGORIES[formData.category]?.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range *</Label>
                  <Select value={formData.priceRange} onValueChange={(value) => handleInputChange("priceRange", value)}>
                    <SelectTrigger className={errors.priceRange ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.priceRange && <p className="text-sm text-destructive">{errors.priceRange}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Delivery Time *</Label>
                  <Select value={formData.deliveryTime} onValueChange={(value) => handleInputChange("deliveryTime", value)}>
                    <SelectTrigger className={errors.deliveryTime ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_TIMES.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.deliveryTime && <p className="text-sm text-destructive">{errors.deliveryTime}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-destructive/20"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              {tags.length < 5 && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (e.g., logo, branding, modern)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag} disabled={!newTag.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Add up to 5 tags to help students find your service. Tags: {tags.length}/5
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Service...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Service
                </>
              )}
            </Button>
            <Link href="/dashboard/services">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
