"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Award, MessageCircle, Calendar } from "lucide-react"
import type { Enrollment, Skill, Artisan } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface LearningDashboardProps {
  enrollments: Enrollment[]
  skills: Skill[]
  artisans: Artisan[]
}

export function LearningDashboard({ enrollments, skills, artisans }: LearningDashboardProps) {
  const { user } = useAuth()
  const [activeEnrollments, setActiveEnrollments] = useState<Enrollment[]>([])
  const [completedEnrollments, setCompletedEnrollments] = useState<Enrollment[]>([])

  useEffect(() => {
    if (!user) return

    const userEnrollments = enrollments.filter((e) => e.studentId === user.id)
    setActiveEnrollments(userEnrollments.filter((e) => e.status === "active" || e.status === "pending"))
    setCompletedEnrollments(userEnrollments.filter((e) => e.status === "completed"))
  }, [enrollments, user])

  const getSkillById = (skillId: string) => skills.find((s) => s.id === skillId)
  const getArtisanById = (artisanId: string) => artisans.find((a) => a.id === artisanId)

  const totalSkillsLearned = completedEnrollments.length
  const averageProgress =
    activeEnrollments.length > 0
      ? activeEnrollments.reduce((sum, e) => sum + e.progress, 0) / activeEnrollments.length
      : 0

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-unilorin-purple" />
              <div>
                <p className="text-2xl font-bold">{activeEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Active Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-unilorin-gold" />
              <div>
                <p className="text-2xl font-bold">{totalSkillsLearned}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-unilorin-green" />
              <div>
                <p className="text-2xl font-bold">{Math.round(averageProgress)}%</p>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Active Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Skills ({activeEnrollments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedEnrollments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeEnrollments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Skills</h3>
                <p className="text-muted-foreground mb-4">Start learning by enrolling in skills from our marketplace</p>
                <Button asChild>
                  <Link href="/marketplace">Browse Skills</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeEnrollments.map((enrollment) => {
                const skill = getSkillById(enrollment.skillId)
                const artisan = getArtisanById(enrollment.providerId)

                if (!skill || !artisan) return null

                return (
                  <Card key={enrollment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{skill.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            with {artisan.firstName} {artisan.lastName}
                          </p>
                        </div>
                        <Badge {...({ variant: enrollment.status === "active" ? "default" : "secondary" } as any)}>
                          {enrollment.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Started {enrollment.enrolledAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{skill.duration}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button {...({ size: "sm" } as any)} className="flex-1" asChild>
                          <Link href={`/learn/${enrollment.id}`}>Continue Learning</Link>
                        </Button>
                        <Button {...({ variant: "outline", size: "sm" } as any)} asChild>
                          <Link href={`/chat/${artisan.id}`}>Message Artisan</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedEnrollments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Skills Yet</h3>
                <p className="text-muted-foreground">Complete your active skills to see them here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedEnrollments.map((enrollment) => {
                const skill = getSkillById(enrollment.skillId)
                const artisan = getArtisanById(enrollment.providerId)

                if (!skill || !artisan) return null

                return (
                  <Card key={enrollment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{skill.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            with {artisan.firstName} {artisan.lastName}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <Award className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Completed {enrollment.completedAt?.toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button {...({ variant: "outline", size: "sm" } as any)} className="flex-1 bg-transparent">
                          View Certificate
                        </Button>
                        <Button {...({ variant: "outline", size: "sm" } as any)}>
                          Leave Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
