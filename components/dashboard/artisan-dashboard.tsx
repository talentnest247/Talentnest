"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReviewSystem } from "@/components/reviews/review-system"
import { supabase } from "@/lib/supabase"
import type { AuthUser } from "@/lib/auth-utils"
import { 
  MessageSquare, 
  Star, 
  Eye,
  Settings,
  Upload,
  CheckCircle,
  DollarSign,
  BarChart3
} from "lucide-react"
import Link from "next/link"

interface ArtisanDashboardProps {
  user: AuthUser
}

interface Inquiry {
  id: string
  studentName: string
  service: string
  message: string
  time: string
  status: string
}

interface Review {
  id: string
  studentName: string
  studentAvatar: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
  serviceName: string
}

export function ArtisanDashboard({ user }: ArtisanDashboardProps) {
  const [stats, setStats] = useState({
    totalViews: 0,
    activeInquiries: 0,
    averageRating: 0,
    totalReviews: 0,
    monthlyEarnings: 0,
    completedProjects: 0,
    responseRate: 0,
    verificationStatus: 'pending' as 'pending' | 'verified' | 'rejected'
  })
  
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [portfolioStats, setPortfolioStats] = useState({
    totalImages: 0,
    portfolioViews: 0,
    lastUpdated: 'Never'
  })

  useEffect(() => {
    const loadArtisanData = async () => {
      try {
        // Fetch real artisan data from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('verified_artisans')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileError) {
          console.error("Error fetching artisan profile:", profileError)
          setStats({
            totalViews: 0,
            activeInquiries: 0,
            averageRating: 0,
            totalReviews: 0,
            monthlyEarnings: 0,
            completedProjects: 0,
            responseRate: 0,
            verificationStatus: 'pending'
          })
          return
        }

        // Fetch real inquiries
        const { data: inquiryData } = await supabase
          .from('inquiries')
          .select('*')
          .eq('artisan_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        // Fetch real reviews
        const { data: reviewData } = await supabase
          .from('reviews')
          .select('*')
          .eq('artisan_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        // Fetch portfolio items count
        const { data: portfolioCount } = await supabase
          .from('portfolio')
          .select('id', { count: 'exact' })
          .eq('provider_id', user.id)

        // Update portfolio stats
        setPortfolioStats(prev => ({
          ...prev,
          totalImages: portfolioCount?.length || 0
        }))

        // Update stats with real data
        setStats({
          totalViews: profileData?.total_views || 0,
          activeInquiries: inquiryData?.length || 0,
          averageRating: reviewData && reviewData.length > 0 ? 
            reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length : 0,
          totalReviews: reviewData?.length || 0,
          monthlyEarnings: 0, // Will be calculated from completed projects
          completedProjects: profileData?.completed_projects || 0,
          responseRate: profileData?.response_rate || 0,
          verificationStatus: profileData?.verification_status || 'pending'
        })

        // Set real inquiries or empty array
        setRecentInquiries(inquiryData?.map(inquiry => ({
          id: inquiry.id,
          studentName: inquiry.student_name || 'Anonymous',
          service: inquiry.service_type || 'General Service',
          message: inquiry.message || '',
          time: new Date(inquiry.created_at).toLocaleDateString(),
          status: inquiry.status || 'new'
        })) || [])

        // Set real reviews or empty array
        setReviews(reviewData?.map(review => ({
          id: review.id,
          studentName: review.student_name || 'Anonymous',
          studentAvatar: '/placeholder.svg',
          rating: review.rating || 0,
          title: review.title || 'Review',
          comment: review.comment || '',
          date: new Date(review.created_at).toLocaleDateString(),
          verified: review.verified || false,
          helpful: review.helpful_count || 0,
          serviceName: review.service_name || 'Service'
        })) || [])

      } catch (error) {
        console.error("Error loading artisan data:", error)
        // Set empty state on error
        setStats({
          totalViews: 0,
          activeInquiries: 0,
          averageRating: 0,
          totalReviews: 0,
          monthlyEarnings: 0,
          completedProjects: 0,
          responseRate: 0,
          verificationStatus: 'pending'
        })
        setRecentInquiries([])
        setReviews([])
      }
    }

    loadArtisanData()
  }, [user.id])

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* Welcome Section */}
      <div className="bg-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt={user.fullName} />
              <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                {user.fullName?.split(' ').map(n => n[0]).join('') || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.firstName || 'Service Provider'}!</h1>
              <p className="text-blue-100">Manage your service business</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-white text-blue-600">
                  Service Provider
                </Badge>
                {stats.verificationStatus === 'verified' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
            <Link href="/profile/edit">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Inquiries</p>
                <p className="text-2xl font-bold text-blue-700">{stats.activeInquiries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-blue-700">{stats.averageRating}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-700">₦{stats.monthlyEarnings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Business Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Projects</span>
              <span className="font-semibold text-blue-700">{stats.completedProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="font-semibold text-blue-700">{stats.responseRate}%</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Customer Rating</span>
                <span className="font-semibold text-blue-700">{stats.averageRating}/5</span>
              </div>
              <Progress value={(stats.averageRating / 5) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Portfolio Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Images</span>
              <span className="font-semibold text-blue-700">{portfolioStats.totalImages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Portfolio Views</span>
              <span className="font-semibold text-blue-700">{portfolioStats.portfolioViews}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="font-semibold text-blue-700">{portfolioStats.lastUpdated}</span>
            </div>
            <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/profile/portfolio">
                Update Portfolio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {inquiry.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-blue-700">{inquiry.studentName}</h4>
                        <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                          {inquiry.service}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{inquiry.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{inquiry.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {inquiry.status === 'new' && (
                      <Badge className="bg-red-100 text-red-700">New</Badge>
                    )}
                    {inquiry.status === 'replied' && (
                      <Badge className="bg-green-100 text-green-700">Replied</Badge>
                    )}
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/messages">
              View All Messages
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <ReviewSystem
        artisanId={user.id}
        reviews={reviews}
        canReview={false}
        userHasReviewed={false}
      />
    </div>
  )
}