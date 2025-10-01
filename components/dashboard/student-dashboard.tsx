"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockDatabase } from "@/lib/mock-data"
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
        const providers = await mockDatabase.getProviders()

        // Mock student-specific data
        setFavoriteProviders(providers.slice(0, 3))
        setRecentlyViewed(providers.slice(3, 6))
        
        // Create mock services from provider specializations
        const mockServices = providers.slice(0, 4).map((provider: Provider, index: number) => ({
          id: `service-${index}`,
          providerId: provider.id,
          title: provider.specialization[0] || 'General Service',
          description: `Professional ${provider.specialization[0]} service`,
          category: provider.specialization[0] || 'General',
          images: [],
          completedAt: new Date(),
          featured: index === 0
        }))
        
        setRecommendedServices(mockServices)
        setStats({
          totalConnections: 12,
          serviceRequests: 8,
          averageRating: 4.7,
          activeChats: 3
        })
      } catch (error) {
        console.error("Error loading student data:", error)
      }
    }

    loadStudentData()
  }, [])

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* Welcome Section */}
      <div className="bg-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt={user.fullName} />
            <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
              {user.fullName?.split(' ').map(n => n[0]).join('') || 'S'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.firstName || 'Student'}!</h1>
            <p className="text-blue-100">Find professional service providers for your needs</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="secondary" className="bg-white text-blue-600">
                {user.department || 'Computer Science'}
              </Badge>
              <Badge variant="secondary" className="bg-white text-blue-600">
                {user.level || '300'} Level
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Connections</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Service Requests</p>
                <p className="text-2xl font-bold text-blue-700">{stats.serviceRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-blue-700">{stats.activeChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Rating Given</p>
                <p className="text-2xl font-bold text-blue-700">{stats.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white h-12">
                <Link href="/services">
                <Search className="h-4 w-4 mr-2" />
                Find Service Providers
              </Link>
            </Button>
              <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 h-12">
                <Link href="/services?category=trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Services
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 h-12">
              <Link href="/contact">
                <MessageSquare className="h-4 w-4 mr-2" />
                Get Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Service Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Favorite Service Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {favoriteProviders.map((provider) => (
              <div key={provider.id} className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={provider.profileImage} alt={provider.firstName} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {provider.firstName[0]}{provider.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-700">{provider.firstName} {provider.lastName}</h4>
                    <p className="text-sm text-gray-600">{provider.businessName}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{provider.rating}</span>
                    </div>
                  </div>
                </div>
                <Button asChild size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={`/artisans/${provider.id}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recently Viewed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recently Viewed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentlyViewed.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-3 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={provider.profileImage} alt={provider.firstName} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {provider.firstName[0]}{provider.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-blue-700">{provider.firstName} {provider.lastName}</h4>
                    <p className="text-sm text-gray-600">{provider.businessName}</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Link href={`/artisans/${provider.id}`}>
                    View Again
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedServices.map((service) => (
              <div key={service.id} className="border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {service.category}
                  </Badge>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href={`/services?service=${service.id}`}>
                      Find Providers
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}