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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { getCurrentUser, saveUser, setCurrentUser } from "@/lib/storage"
import { validatePhoneNumber, formatPhoneNumber } from "@/lib/validation"
import type { User } from "@/lib/types"
import { ArrowLeft, Camera, Plus, X, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    whatsappNumber: "",
    faculty: "",
    department: "",
    level: "",
    bio: "",
  })
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([])
  const [newPortfolioLink, setNewPortfolioLink] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setFormData({
      fullName: currentUser.fullName,
      phoneNumber: currentUser.phoneNumber || "",
      whatsappNumber: currentUser.whatsappNumber || "",
      faculty: currentUser.faculty || "",
      department: currentUser.department || "",
      level: currentUser.level || "",
      bio: currentUser.bio || "",
    })
    setSkills(currentUser.skills || [])
    setPortfolioLinks(currentUser.portfolioLinks || [])
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
  }

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() && !portfolioLinks.includes(newPortfolioLink.trim())) {
      setPortfolioLinks((prev) => [...prev, newPortfolioLink.trim()])
      setNewPortfolioLink("")
    }
  }

  const removePortfolioLink = (linkToRemove: string) => {
    setPortfolioLinks((prev) => prev.filter((link) => link !== linkToRemove))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format"
    }

    if (formData.whatsappNumber && !validatePhoneNumber(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Invalid WhatsApp number format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    setIsLoading(true)

    try {
      const updatedUser: User = {
        ...user,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber ? formatPhoneNumber(formData.phoneNumber) : "",
        whatsappNumber: formData.whatsappNumber
          ? formatPhoneNumber(formData.whatsappNumber)
          : formData.phoneNumber
            ? formatPhoneNumber(formData.phoneNumber)
            : "",
        faculty: formData.faculty,
        department: formData.department,
        level: formData.level,
        bio: formData.bio,
        skills,
        portfolioLinks,
        updatedAt: new Date().toISOString(),
      }

      saveUser(updatedUser)
      setCurrentUser(updatedUser)
      setUser(updatedUser)
      setIsSaved(true)

      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      setErrors({ submit: "Failed to update profile. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

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
            <h1 className="text-3xl font-serif font-bold text-primary">Edit Profile</h1>
            <p className="text-muted-foreground">Update your information and showcase your skills</p>
          </div>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">
                      {getInitials(formData.fullName || user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="font-serif">{formData.fullName || user.fullName}</CardTitle>
                <CardDescription>
                  {user.matricNumber} • {formData.level || user.level}
                </CardDescription>
                <CardDescription>{formData.faculty || user.faculty}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.bio && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground">{formData.bio}</p>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {portfolioLinks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Portfolio</h4>
                    <div className="space-y-1">
                      {portfolioLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-secondary hover:underline block truncate"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Profile Information</CardTitle>
                <CardDescription>Update your profile to help other students find and connect with you</CardDescription>
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
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={errors.fullName ? "border-destructive" : ""}
                        required
                      />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="08012345678"
                          className={errors.phoneNumber ? "border-destructive" : ""}
                        />
                        {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                        <Input
                          id="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                          placeholder="Same as phone if different"
                          className={errors.whatsappNumber ? "border-destructive" : ""}
                        />
                        {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty">Faculty</Label>
                        <Select value={formData.faculty} onValueChange={(value) => handleInputChange("faculty", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arts">Faculty of Arts</SelectItem>
                            <SelectItem value="science">Faculty of Science</SelectItem>
                            <SelectItem value="engineering">Faculty of Engineering & Technology</SelectItem>
                            <SelectItem value="social-sciences">Faculty of Social Sciences</SelectItem>
                            <SelectItem value="education">Faculty of Education</SelectItem>
                            <SelectItem value="law">Faculty of Law</SelectItem>
                            <SelectItem value="agriculture">Faculty of Agriculture</SelectItem>
                            <SelectItem value="management">Faculty of Management Sciences</SelectItem>
                            <SelectItem value="environmental">Faculty of Environmental Sciences</SelectItem>
                            <SelectItem value="communication">
                              Faculty of Communication & Information Sciences
                            </SelectItem>
                            <SelectItem value="life-sciences">Faculty of Life Sciences</SelectItem>
                            <SelectItem value="pharmacy">Faculty of Pharmaceutical Sciences</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleInputChange("department", e.target.value)}
                          placeholder="Your department"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Current Level</Label>
                      <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100L">100 Level</SelectItem>
                          <SelectItem value="200L">200 Level</SelectItem>
                          <SelectItem value="300L">300 Level</SelectItem>
                          <SelectItem value="400L">400 Level</SelectItem>
                          <SelectItem value="500L">500 Level</SelectItem>
                          <SelectItem value="600L">600 Level</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Tell others about yourself, your interests, and what you're passionate about..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Skills</h3>

                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Portfolio Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Portfolio Links</h3>

                    <div className="flex gap-2">
                      <Input
                        value={newPortfolioLink}
                        onChange={(e) => setNewPortfolioLink(e.target.value)}
                        placeholder="Add portfolio link (website, GitHub, Behance, etc.)..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPortfolioLink())}
                      />
                      <Button type="button" onClick={addPortfolioLink} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {portfolioLinks.length > 0 && (
                      <div className="space-y-2">
                        {portfolioLinks.map((link, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:underline truncate flex-1"
                            >
                              {link}
                            </a>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePortfolioLink(link)}
                              className="ml-2 text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? "Saving..." : "Save Changes"}
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
      </div>

      <Footer />
    </div>
  )
}
