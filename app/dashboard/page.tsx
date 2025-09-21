"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { mockDatabase } from "@/lib/mock-data"
import type { Enrollment, Skill, Artisan } from "@/lib/types"
import {
  BookOpen, GraduationCap, Trophy, Clock, Star, TrendingUp, Calendar,
  Target, Award, Users, ChevronRight, Play, CheckCircle,
  BarChart3, PieChart, Activity, Bookmark, Bell, MessageSquare
} from "lucide-react"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [skillsData, artisansData] = await Promise.all([
          mockDatabase.getSkills(), 
          mockDatabase.getArtisans()
        ])

        // Enhanced mock enrollments with more realistic data
        const mockEnrollments: Enrollment[] = [
          {
            id: "1",
            studentId: user?.id || "student1",
            skillId: "1",
            providerId: "1",
            status: "active",
            progress: 75,
            enrolledAt: new Date("2024-01-15"),
          },
          {
            id: "2",
            studentId: user?.id || "student1",
            skillId: "2",
            providerId: "2",
            status: "active",
            progress: 45,
            enrolledAt: new Date("2024-01-20"),
          },
          {
            id: "3",
            studentId: user?.id || "student1",
            skillId: "3",
            providerId: "3",
            status: "completed",
            progress: 100,
            enrolledAt: new Date("2023-12-01"),
            completedAt: new Date("2024-01-10"),
          },
        ]

        setEnrollments(mockEnrollments)
        setSkills(skillsData)
        setArtisans(artisansData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [user?.id])

  // Calculate statistics
  const stats = {
    totalEnrollments: enrollments.length,
    activeEnrollments: enrollments.filter(e => e.status === "active").length,
    completedEnrollments: enrollments.filter(e => e.status === "completed").length,
    averageProgress: enrollments.length > 0 
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0,
    totalStudyHours: 156, // Mock data
    certificatesEarned: enrollments.filter(e => e.status === "completed").length,
    currentStreak: 12, // Mock data
    nextGoal: "Complete Fashion Design Course"
  }

  const recentActivities = [
    { type: "lesson", title: "Completed Advanced Pattern Making", time: "2 hours ago", icon: CheckCircle },
    { type: "assignment", title: "Submitted Fashion Design Project", time: "1 day ago", icon: BookOpen },
    { type: "achievement", title: "Earned 'Quick Learner' Badge", time: "2 days ago", icon: Trophy },
    { type: "enrollment", title: "Enrolled in Textile Arts Course", time: "3 days ago", icon: GraduationCap },
    { type: "milestone", title: "Reached 75% in Pattern Making", time: "1 week ago", icon: Target }
  ]

  const upcomingDeadlines = [
    { title: "Fashion Design Final Project", dueDate: "Dec 20, 2024", priority: "high" },
    { title: "Textile Arts Assignment 3", dueDate: "Dec 22, 2024", priority: "medium" },
    { title: "Pattern Making Quiz", dueDate: "Dec 25, 2024", priority: "low" }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-800 mb-2">
                Welcome back, {user?.firstName || user?.fullName || 'Student'}! 👋
              </h1>
              <p className="text-blue-600">Ready to continue your learning journey?</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
              <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Active Courses</p>
                    <p className="text-3xl font-bold">{stats.activeEnrollments}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stats.totalEnrollments} total enrolled
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-600 to-green-700 border-green-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold">{stats.completedEnrollments}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center text-sm text-green-100">
                  <Award className="h-4 w-4 mr-1" />
                  {stats.certificatesEarned} certificates earned
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg Progress</p>
                    <p className="text-3xl font-bold">{stats.averageProgress}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center text-sm text-purple-100">
                  <Target className="h-4 w-4 mr-1" />
                  Keep up the great work!
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-600 to-orange-700 border-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Study Streak</p>
                    <p className="text-3xl font-bold">{stats.currentStreak}</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center text-sm text-orange-100">
                  <Clock className="h-4 w-4 mr-1" />
                  {stats.totalStudyHours} hours total
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-blue-50 border-blue-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-blue-200 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-blue-800 flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex-shrink-0">
                          <activity.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-blue-800 font-medium">{activity.title}</p>
                          <p className="text-blue-600 text-sm">{activity.time}</p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-600 text-white">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Upcoming */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Resume Last Course
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-blue-400 text-blue-200 hover:bg-blue-800">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse New Skills
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-blue-400 text-blue-200 hover:bg-blue-800">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask Instructor
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-blue-400 text-blue-200 hover:bg-blue-800">
                      <Users className="h-4 w-4 mr-2" />
                      Join Study Group
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{deadline.title}</p>
                          <p className="text-blue-200 text-xs">{deadline.dueDate}</p>
                        </div>
                        <Badge 
                          variant={deadline.priority === "high" ? "destructive" : deadline.priority === "medium" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {deadline.priority}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const skill = skills.find(s => s.id === enrollment.skillId)
                const artisan = artisans.find(a => a.id === enrollment.providerId)
                
                if (!skill) return null

                return (
                  <Card key={enrollment.id} className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{skill.title}</h3>
                          <p className="text-blue-200 text-sm">{artisan?.businessName || artisan?.fullName}</p>
                        </div>
                        <Badge 
                          variant={enrollment.status === "completed" ? "default" : "secondary"}
                          className={enrollment.status === "completed" ? "bg-green-600" : "bg-blue-600"}
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-blue-200 mb-1">
                          <span>Progress</span>
                          <span>{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2 bg-white/20" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-blue-200 text-sm">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {enrollment.status === "completed" ? "Completed" : "In Progress"}
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          {enrollment.status === "completed" ? "Review" : "Continue"}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Analytics */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Total Study Time</span>
                      <span className="text-white font-semibold">{stats.totalStudyHours} hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Average Session</span>
                      <span className="text-white font-semibold">2.5 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Completion Rate</span>
                      <span className="text-white font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">Current Streak</span>
                      <span className="text-white font-semibold">{stats.currentStreak} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Progress */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Skills Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrollments.map((enrollment) => {
                    const skill = skills.find(s => s.id === enrollment.skillId)
                    if (!skill) return null

                    return (
                      <div key={enrollment.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-200">{skill.title}</span>
                          <span className="text-white">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2 bg-white/20" />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievement Cards */}
              <Card className="bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="h-8 w-8 text-yellow-200" />
                    <Badge className="bg-yellow-800 text-yellow-100">Earned</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quick Learner</h3>
                  <p className="text-yellow-100 text-sm">Completed your first course in record time!</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="h-8 w-8 text-purple-200" />
                    <Badge className="bg-purple-800 text-purple-100">Earned</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fashion Expert</h3>
                  <p className="text-purple-100 text-sm">Mastered advanced fashion design techniques!</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="h-8 w-8 text-blue-200" />
                    <Badge className="bg-blue-800 text-blue-100">Earned</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Perfect Attendance</h3>
                  <p className="text-blue-100 text-sm">Maintained 100% attendance for 30 days!</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 border-dashed">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Bookmark className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Skill Master</h3>
                  <p className="text-blue-200 text-sm mb-4">Complete 5 courses to unlock this achievement</p>
                  <Progress value={60} className="h-2 bg-white/20" />
                  <p className="text-blue-200 text-xs mt-2">3/5 courses completed</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 border-dashed">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Community Helper</h3>
                  <p className="text-blue-200 text-sm mb-4">Help 10 fellow students to unlock</p>
                  <Progress value={20} className="h-2 bg-white/20" />
                  <p className="text-blue-200 text-xs mt-2">2/10 students helped</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 border-dashed">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Goal Crusher</h3>
                  <p className="text-blue-200 text-sm mb-4">Maintain 90% average across all courses</p>
                  <Progress value={85} className="h-2 bg-white/20" />
                  <p className="text-blue-200 text-xs mt-2">85% average - almost there!</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  )
}
