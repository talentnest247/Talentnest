"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen,
  Clock,
  Users,
  DollarSign,
  Award,
  Info,
  ChevronRight
} from "lucide-react"

const categories = [
  "Fashion & Tailoring",
  "Technology & Programming",
  "Arts & Crafts",
  "Beauty & Cosmetics",
  "Food & Culinary",
  "Photography & Videography",
  "Music & Entertainment",
  "Sports & Fitness",
  "Business & Entrepreneurship",
  "Other"
]

const difficultyLevels = [
  { value: "beginner", label: "Beginner", description: "No prior experience needed" },
  { value: "intermediate", label: "Intermediate", description: "Some basic knowledge required" },
  { value: "advanced", label: "Advanced", description: "Extensive experience needed" }
]

export default function AddSkillPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  type FormData = {
    title: string
    category: string
    description: string
    difficulty: string
    duration: string
    price: string
    maxStudents: string
  }
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    difficulty: "",
    duration: "",
    price: "",
    maxStudents: ""
  })
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((data: FormData) => {
    const errors: Partial<FormData> = {}
    if (!data.title.trim()) errors.title = "Title is required"
    if (!data.category) errors.category = "Category is required"
    if (!data.description.trim()) errors.description = "Description is required"
    if (!data.difficulty) errors.difficulty = "Difficulty is required"
    if (!data.duration.trim()) errors.duration = "Duration is required"
    if (!data.price.trim() || isNaN(Number(data.price)) || Number(data.price) <= 0) errors.price = "Valid price required"
    if (!data.maxStudents.trim() || isNaN(Number(data.maxStudents)) || Number(data.maxStudents) < 1) errors.maxStudents = "Valid max students required"
    return errors
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a skill.",
      })
      router.push("/login")
      return
    }
    const errors = validate(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast({
        title: "Please fix the errors",
        description: "Check the form for missing or invalid fields.",
        variant: "destructive"
      })
      return
    }
    setIsSubmitting(true)
    try {
      const cleanedData = {
        ...formData,
        price: parseFloat(formData.price),
        maxStudents: parseInt(formData.maxStudents)
      }
      // TODO: send cleanedData to API
      toast({
        title: "Skill Added Successfully!",
        description: "Your skill has been submitted for review and will be live soon.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, isAuthenticated, router, toast, validate])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20">
          <Card className="text-center p-8 bg-white border shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please log in to share your skills with the community.</p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Log In
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">Add New Skill</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Skill</h1>
              <p className="text-gray-600">Share your expertise and teach others in the UNILORIN community</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Getting Started</h3>
              <p className="text-sm text-blue-700 mt-1">
                Fill out the form below to create your skill. Make sure to provide clear descriptions and set appropriate pricing for your expertise.
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-white border shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-white">
            <CardTitle className="text-xl font-semibold text-gray-900">Skill Information</CardTitle>
            <CardDescription className="text-gray-600">
              Provide the basic details about the skill you want to teach
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Basic Information</h3>
                  <p className="text-sm text-gray-600">Tell us about the skill you want to teach</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                      Skill Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Professional Fashion Design Masterclass"
                      aria-invalid={!!formErrors.title}
                      aria-describedby="title-error"
                      required
                      className={`h-11 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 rounded-md bg-white`}
                    />
                    {formErrors.title && <div id="title-error" className="text-red-600 text-xs mt-1">{formErrors.title}</div>}
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className={`h-11 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 rounded-md bg-white`} aria-invalid={!!formErrors.category} aria-describedby="category-error">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="hover:bg-gray-50">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && <div id="category-error" className="text-red-600 text-xs mt-1">{formErrors.category}</div>}
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 mb-2 block">
                      Difficulty Level *
                    </Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                      <SelectTrigger className={`h-11 border ${formErrors.difficulty ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 rounded-md bg-white`} aria-invalid={!!formErrors.difficulty} aria-describedby="difficulty-error">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value} className="hover:bg-gray-50">
                            <div className="py-1">
                              <div className="font-medium">{level.label}</div>
                              <div className="text-sm text-gray-500">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.difficulty && <div id="difficulty-error" className="text-red-600 text-xs mt-1">{formErrors.difficulty}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe what students will learn, your teaching approach, and why they should choose your skill..."
                      rows={4}
                      aria-invalid={!!formErrors.description}
                      aria-describedby="description-error"
                      required
                      className={`border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 rounded-md resize-none bg-white`}
                    />
                    {formErrors.description && <div id="description-error" className="text-red-600 text-xs mt-1">{formErrors.description}</div>}
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-200">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Course Details</h3>
                  <p className="text-sm text-gray-600">Set up your course structure and pricing</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
                      Duration *
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="e.g., 4 weeks, 10 hours"
                      aria-invalid={!!formErrors.duration}
                      aria-describedby="duration-error"
                      required
                      className={`h-11 border ${formErrors.duration ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 rounded-md bg-white`}
                    />
                    {formErrors.duration && <div id="duration-error" className="text-red-600 text-xs mt-1">{formErrors.duration}</div>}
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                      Price (₦) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="15000"
                      aria-invalid={!!formErrors.price}
                      aria-describedby="price-error"
                      required
                      className={`h-11 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 rounded-md bg-white`}
                    />
                    {formErrors.price && <div id="price-error" className="text-red-600 text-xs mt-1">{formErrors.price}</div>}
                  </div>

                  <div>
                    <Label htmlFor="maxStudents" className="text-sm font-medium text-gray-700 mb-2 block">
                      Max Students *
                    </Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => handleInputChange("maxStudents", e.target.value)}
                      placeholder="20"
                      aria-invalid={!!formErrors.maxStudents}
                      aria-describedby="maxStudents-error"
                      required
                      className={`h-11 border ${formErrors.maxStudents ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 rounded-md bg-white`}
                    />
                    {formErrors.maxStudents && <div id="maxStudents-error" className="text-red-600 text-xs mt-1">{formErrors.maxStudents}</div>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="h-11 px-6 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Create Course
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
