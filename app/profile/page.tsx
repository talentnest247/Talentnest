"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera, GraduationCap,
  Trophy, Clock, CheckCircle, Shield, Star, BookOpen, Award, Settings, Eye,
  Download, Share2, Bell, Lock, CreditCard, Activity
} from "lucide-react"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  studentId: string
  level: string
  bio: string
  address: string
  dateOfBirth: string
  gender: string
  nationality: string
  stateOfOrigin: string
  emergencyContact: string
  emergencyPhone: string
}

function ProfileContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  
  // Comprehensive form data
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    studentId: "",
    level: "",
    bio: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    stateOfOrigin: "",
    emergencyContact: "",
    emergencyPhone: ""
  })

  // Update form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.fullName?.split(' ')[0] || "",
        lastName: user.lastName || user.fullName?.split(' ')[1] || "",
        email: user.email || "",
        phone: user.phone?.toString() || "",
        department: user.department || "",
        studentId: user.studentId || "",
        level: user.level?.toString() || "",
        bio: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        nationality: "Nigerian",
        stateOfOrigin: "",
        emergencyContact: "",
        emergencyPhone: ""
      })
    }
  }, [user])

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Profile Updated Successfully",
          description: "Your profile information has been saved.",
        })
        setIsEditing(false)
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: "Unable to save changes. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = useCallback(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.fullName?.split(' ')[0] || "",
        lastName: user.lastName || user.fullName?.split(' ')[1] || "",
        email: user.email || "",
        phone: user.phone?.toString() || "",
        department: user.department || "",
        studentId: user.studentId || "",
        level: user.level?.toString() || "",
        bio: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        nationality: "Nigerian",
        stateOfOrigin: "",
        emergencyContact: "",
        emergencyPhone: ""
      })
    }
    setIsEditing(false)
  }, [user])

  const profileCompleteness = useCallback(() => {
    const fields = Object.values(formData).filter(value =>
      value && value.toString().trim() !== ""
    )
    return Math.round((fields.length / Object.keys(formData).length) * 100)
  }, [formData])

  const mockEnrollments = [
    { id: 1, skill: "Fashion Design", progress: 75, status: "Active", instructor: "Mrs. Adebayo", nextClass: "Dec 18, 2024" },
    { id: 2, skill: "Textile Arts", progress: 90, status: "Active", instructor: "Mr. Okafor", nextClass: "Dec 20, 2024" },
    { id: 3, skill: "Pattern Making", progress: 100, status: "Completed", instructor: "Dr. Adeola", completedDate: "Nov 30, 2024" }
  ]

  const mockAchievements = [
    { title: "Quick Learner", description: "Completed first skill in record time", icon: Trophy, color: "text-yellow-500" },
    { title: "Fashion Expert", description: "Mastered advanced fashion techniques", icon: Award, color: "text-purple-500" },
    { title: "Perfect Attendance", description: "100% class attendance rate", icon: Star, color: "text-blue-500" },
    { title: "Peer Helper", description: "Helped 10+ fellow students", icon: User, color: "text-green-500" }
  ]

  const recentActivities = [
    { action: "Completed Pattern Making Module 5", time: "2 hours ago", icon: CheckCircle },
    { action: "Submitted Fashion Design Assignment", time: "1 day ago", icon: BookOpen },
    { action: "Joined Advanced Textiles Class", time: "3 days ago", icon: GraduationCap },
    { action: "Updated Profile Information", time: "1 week ago", icon: User }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Student Profile</h1>
              <p className="text-blue-200">Manage your academic profile and learning journey</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                <Download className="h-4 w-4 mr-2" />
                Export Profile
              </Button>
              <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>

          {/* Profile Summary Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white/20">
                    <AvatarImage src="/placeholder-user.jpg" alt={user?.fullName ?? "User avatar"} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-bold">
                      {(() => {
                        const name = user?.fullName ?? ""
                        const initials = name
                          .split(/\s+/)
                          .filter(Boolean)
                          .map(n => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                        return initials || "U"
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-blue-600 border-2 border-white text-white hover:bg-blue-700"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">{user?.fullName}</h2>
                  <p className="text-blue-200 mb-2">{user?.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {user?.department || "Department Not Set"}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      Level {user?.level || "Not Set"}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-600 text-white">
                      Student ID: {user?.studentId || "Not Set"}
                    </Badge>
                  </div>
                  
                  {/* Profile Completion */}
                  <div className="max-w-md">
                    <div className="flex justify-between text-sm text-blue-200 mb-1">
                      <span>Profile Completion</span>
                      <span>{profileCompleteness()}%</span>
                    </div>
                    <Progress value={profileCompleteness()} className="h-2 bg-white/20" />
                  </div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl font-bold text-white">3</div>
                  <div className="text-sm text-blue-200">Active Skills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <GraduationCap className="h-4 w-4 mr-2" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Enrollments */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Current Enrollments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockEnrollments.map((enrollment) => (
                      <div key={enrollment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{enrollment.skill}</h4>
                          <Badge 
                            variant={enrollment.status === "Completed" ? "default" : "secondary"}
                            className={enrollment.status === "Completed" ? "bg-green-600" : "bg-blue-600"}
                          >
                            {enrollment.status}
                          </Badge>
                        </div>
                        <p className="text-blue-200 text-sm mb-2">Instructor: {enrollment.instructor}</p>
                        <div className="flex justify-between text-sm text-blue-200 mb-1">
                          <span>Progress</span>
                          <span>{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2 mb-2 bg-white/20" />
                        <p className="text-blue-200 text-sm">
                          {enrollment.status === "Completed" 
                            ? `Completed: ${enrollment.completedDate}`
                            : `Next Class: ${enrollment.nextClass}`
                          }
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Achievements */}
              <div>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <achievement.icon className={`h-5 w-5 ${achievement.color} mt-0.5`} />
                        <div>
                          <h5 className="font-medium text-white text-sm">{achievement.title}</h5>
                          <p className="text-blue-200 text-xs">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <activity.icon className="h-4 w-4 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-blue-200 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <CardDescription className="text-blue-200">
                      Manage your personal details and contact information
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="border-blue-400 text-blue-200 hover:bg-blue-800"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="border-blue-400 text-blue-200 hover:bg-blue-800"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-blue-200">First Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <User className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{formData.firstName || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-blue-200">Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <User className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{formData.lastName || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-blue-200">Email Address</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                        placeholder="Enter email address"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <Mail className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{formData.email || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-blue-200">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                        placeholder="+234 XXX XXX XXXX"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <Phone className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{formData.phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-blue-200">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{formData.dateOfBirth || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-blue-200">Gender</Label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                        aria-label="Select gender"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <User className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{formData.gender || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-blue-200">Address</Label>
                    {isEditing ? (
                      <Textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                        placeholder="Enter your address"
                        rows={3}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 py-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span className="text-white">{formData.address || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-blue-200">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-blue-300"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <div className="py-2">
                        <span className="text-white">{formData.bio || "No bio provided"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Information Tab */}
          <TabsContent value="academic" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Academic Information</CardTitle>
                <CardDescription className="text-blue-200">
                  Your academic details and university information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-blue-200">Student ID</Label>
                    <div className="flex items-center space-x-2 py-2">
                      <GraduationCap className="h-4 w-4 text-blue-400" />
                      <span className="text-white">{formData.studentId || "Not provided"}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-blue-200">Department</Label>
                    <div className="flex items-center space-x-2 py-2">
                      <GraduationCap className="h-4 w-4 text-blue-400" />
                      <span className="text-white">{formData.department || "Not provided"}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-blue-200">Current Level</Label>
                    <div className="flex items-center space-x-2 py-2">
                      <GraduationCap className="h-4 w-4 text-blue-400" />
                      <span className="text-white">Level {formData.level || "Not provided"}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-blue-200">Academic Status</Label>
                    <div className="flex items-center space-x-2 py-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-white">Active Student</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">Change Password</h4>
                        <p className="text-blue-200 text-sm">Update your account password</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-blue-200 text-sm">Manage email notification preferences</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">Payment Methods</h4>
                        <p className="text-blue-200 text-sm">Manage your payment information</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Activity Log
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Your recent account and learning activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <activity.icon className="h-5 w-5 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-white">{activity.action}</p>
                        <p className="text-blue-200 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="text-white font-medium">Account Visibility</h4>
                      <p className="text-blue-200 text-sm">Control who can see your profile</p>
                    </div>
                    <select 
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                      aria-label="Account visibility setting"
                    >
                      <option value="public">Public</option>
                      <option value="university">University Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="text-white font-medium">Data Export</h4>
                      <p className="text-blue-200 text-sm">Download your account data</p>
                    </div>
                    <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                    <div>
                      <h4 className="text-red-300 font-medium">Danger Zone</h4>
                      <p className="text-red-200 text-sm">Permanently delete your account</p>
                    </div>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  )
}
