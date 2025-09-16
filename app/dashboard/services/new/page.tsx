"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { getCurrentUser, saveService, generateId, getCurrentTimestamp } from "@/lib/storage"
import type { User, Service } from "@/lib/types"
import { ArrowLeft, Plus, X, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NewServicePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
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

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Service title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Service description is required"
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters"
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    if (!formData.priceRange.trim()) {
      newErrors.priceRange = "Price range is required"
    }

    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = "Delivery time is required"
    }

    if (tags.length === 0) {
      newErrors.tags = "Please add at least one tag"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    setIsLoading(true)

    try {
      const newService: Service = {
        id: generateId(),
        userId: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category as "digital" | "artisan" | "tutoring",
        subcategory: formData.subcategory || undefined,
        priceRange: formData.priceRange.trim(),
        deliveryTime: formData.deliveryTime.trim(),
        images: [],
        tags,
        isActive: true,
        status: "pending",
        viewsCount: 0,
        ordersCount: 0,
        rating: 0,
        totalReviews: 0,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      }

      saveService(newService)
      router.push("/dashboard?tab=services")
    } catch (error) {
      console.error('Failed to create service:', error)
      setErrors({ submit: "Failed to create service. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const categoryOptions = [
    {
      value: "digital",
      label: "Digital Services",
      subcategories: ["Web Development", "Graphic Design", "Photography", "Video Editing", "Writing", "Social Media"],
    },
    {
      value: "artisan",
      label: "Artisan Crafts",
      subcategories: ["Tailoring", "Jewelry Making", "Art & Painting", "Crafts", "Fashion Design", "Accessories"],
    },
    {
      value: "tutoring",
      label: "Learning & Tutoring",
      subcategories: [
        "Academic Tutoring",
        "Skill Workshops",
        "Language Teaching",
        "Music Lessons",
        "Mentoring",
        "Training",
      ],
    },
  ]

  const selectedCategoryData = categoryOptions.find((cat) => cat.value === formData.category)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Add New Service</h1>
            <p className="text-muted-foreground">Showcase your skills and start earning from your talents</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Service Details</CardTitle>
              <CardDescription>
                Provide detailed information about your service to attract potential clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.submit && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Professional Logo Design for Your Brand"
                      className={errors.title ? "border-destructive" : ""}
                      required
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    <p className="text-xs text-muted-foreground">
                      Create a clear, descriptive title that highlights what you offer
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Service Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your service in detail. What do you offer? What makes you unique? What can clients expect?"
                      className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                      required
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/500 characters (minimum 50 required)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) => handleInputChange("subcategory", value)}
                        disabled={!formData.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategoryData?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Pricing and Delivery */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing & Delivery</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceRange">Price Range</Label>
                      <Input
                        id="priceRange"
                        value={formData.priceRange}
                        onChange={(e) => handleInputChange("priceRange", e.target.value)}
                        placeholder="e.g., ₦5,000 - ₦15,000"
                        className={errors.priceRange ? "border-destructive" : ""}
                        required
                      />
                      {errors.priceRange && <p className="text-sm text-destructive">{errors.priceRange}</p>}
                      <p className="text-xs text-muted-foreground">Provide a price range or starting price</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryTime">Delivery Time</Label>
                      <Select
                        value={formData.deliveryTime}
                        onValueChange={(value) => handleInputChange("deliveryTime", value)}
                      >
                        <SelectTrigger className={errors.deliveryTime ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select delivery time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 day">1 day</SelectItem>
                          <SelectItem value="2-3 days">2-3 days</SelectItem>
                          <SelectItem value="1 week">1 week</SelectItem>
                          <SelectItem value="2 weeks">2 weeks</SelectItem>
                          <SelectItem value="1 month">1 month</SelectItem>
                          <SelectItem value="Custom timeline">Custom timeline</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.deliveryTime && <p className="text-sm text-destructive">{errors.deliveryTime}</p>}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tags</h3>

                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g., logo, branding, creative)..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      disabled={tags.length >= 10}
                    />
                    <Button type="button" onClick={addTag} size="sm" disabled={tags.length >= 10}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button 
                            type="button" 
                            onClick={() => removeTag(tag)} 
                            className="ml-1 hover:text-destructive"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Add up to 10 tags to help clients find your service ({tags.length}/10)
                  </p>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Images (Optional)</h3>

                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Upload images to showcase your work</p>
                    <p className="text-xs text-muted-foreground">
                      Add portfolio samples, before/after photos, or examples of your work
                    </p>
                    <Button type="button" variant="outline" className="mt-4 bg-transparent" disabled>
                      Upload Images (Coming Soon)
                    </Button>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Creating Service..." : "Create Service"}
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
