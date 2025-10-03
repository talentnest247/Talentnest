"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import type { AuthUser } from "@/lib/auth-utils"
import type { Provider, PortfolioItem } from "@/lib/types"
import { 
  BookOpen, 
  MessageSquare, 
  Search, 
  Star, 
  Heart,
  TrendingUp,
  Users,
  Award,
  Eye
} from "lucide-react"
import Link from "next/link"

interface StudentDashboardProps {
  user: AuthUser
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const [favoriteProviders, setFavoriteProviders] = useState<Provider[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Provider[]>([])
  const [recommendedServices, setRecommendedServices] = useState<PortfolioItem[]>([])
  const [stats, setStats] = useState({
    totalConnections: 0,
    serviceRequests: 0,
    averageRating: 0,
    activeChats: 0
  })

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Fetch real data from Supabase
        const { data: providers, error: providersError } = await supabase
          .from('verified_artisans')
          .select('*')
          .limit(10)

        if (providersError) {
          console.error("Error fetching providers:", providersError)
          // Set empty state when no data
          setFavoriteProviders([])
          setRecentlyViewed([])
          setRecommendedServices([])
          setStats({
            totalConnections: 0,
            serviceRequests: 0,
            averageRating: 0,
            activeChats: 0
          })
          return
        }

        // Set real data or empty arrays if no data
        const validProviders = providers || []
        setFavoriteProviders(validProviders.slice(0, 3))
        setRecentlyViewed(validProviders.slice(3, 6))
        
        // Fetch real services/portfolio items
        const { data: portfolioItems } = await supabase
          .from('portfolio')
          .select('*')
          .limit(4)
        
        setRecommendedServices(portfolioItems || [])

        // Fetch real user statistics
        const { data: connections } = await supabase
          .from('connections')
          .select('id')
          .eq('student_id', user.id)

        const { data: requests } = await supabase
          .from('service_requests')
          .select('id')
          .eq('student_id', user.id)

        const { data: chats } = await supabase
          .from('messages')
          .select('id')
          .eq('student_id', user.id)
          .eq('status', 'active')

        setStats({
          totalConnections: connections?.length || 0,
          serviceRequests: requests?.length || 0,
          averageRating: 0, // Calculate from actual reviews when available
          activeChats: chats?.length || 0
        })
      } catch (error) {
        console.error("Error loading student data:", error)
        // Set empty state on error
        setFavoriteProviders([])
        setRecentlyViewed([])
        setRecommendedServices([])
        setStats({
          totalConnections: 0,
          serviceRequests: 0,
          averageRating: 0,
          activeChats: 0
        })
      }
    }

    loadStudentData()
  }, [user.id])

  return (
    <div className="space-y-4 sm:space-y-6 bg-white min-h-screen p-3 sm:p-6">
      {/* Welcome Section */}
      <div className="bg-blue-600 text-white rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarImage src="/placeholder.svg" alt={user.fullName} />
            <AvatarFallback className="bg-white text-blue-600 text-lg sm:text-xl font-bold">
              {user.fullName?.split(' ').map(n => n[0]).join('') || 'S'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user.firstName || 'Student'}!</h1>
            <p className="text-blue-100 text-sm sm:text-base">Find professional service providers for your needs</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-white text-blue-600 text-xs sm:text-sm">
                {user.department || 'Computer Science'}
              </Badge>
              <Badge variant="secondary" className="bg-white text-blue-600 text-xs sm:text-sm">
                {user.level || '300'} Level
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Connections</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">{stats.totalConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Requests</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">{stats.serviceRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Chats</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">{stats.activeChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Rating</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">{stats.averageRating || 0}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              Find Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">Discover professional service providers in your area</p>
            <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/marketplace">Browse Services</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">Check your conversations with service providers</p>
            <Button asChild size="sm" variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              <Link href="/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-blue-700 flex items-center gap-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">Update your profile and preferences</p>
            <Button asChild size="sm" variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              <Link href="/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Providers */}
      {favoriteProviders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-blue-700 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Favorite Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteProviders.map((provider) => (
                <div key={provider.id} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={provider.profileImage} alt={provider.fullName} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                        {provider.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-blue-700 text-sm truncate">{provider.fullName}</h4>
                      <p className="text-xs text-gray-600 truncate">{provider.specialization?.[0] || 'Service Provider'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{provider.rating || 0}</span>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Link href={`/artisans/${provider.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-blue-700 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentlyViewed.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Eye className="h-12 w-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-600 text-sm">No recent activity yet</p>
              <p className="text-gray-500 text-xs mt-1">Start exploring services to see your activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentlyViewed.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={provider.profileImage} alt={provider.fullName} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {provider.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-blue-700">{provider.fullName}</p>
                      <p className="text-xs text-gray-600">{provider.specialization?.[0] || 'Service Provider'}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs text-blue-600 hover:text-blue-800">
                    <Link href={`/artisans/${provider.id}`}>View Profile</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}