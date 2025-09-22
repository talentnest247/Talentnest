import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Users, CheckCircle, Eye } from "lucide-react"
import { WhatsAppCTACompact } from "@/components/providers/whatsapp-cta"
import { useAuth } from "@/contexts/auth-context"
import type { Provider, Student } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface ProviderCardProps {
  artisan: Provider // Keep as "artisan" for now to maintain compatibility
}

export function ArtisanCard({ artisan }: ProviderCardProps) {
  const { user } = useAuth()
  const initials = `${artisan.firstName[0]}${artisan.lastName[0]}`

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 border-0 shadow-md bg-white/95 backdrop-blur-sm overflow-hidden group">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            <Avatar className="h-14 w-14 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
              <AvatarImage
                src={artisan.profileImage || "/placeholder.svg"}
                alt={`${artisan.firstName} ${artisan.lastName}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {artisan.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="h-3 w-3" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-bold text-lg leading-tight text-gray-900 truncate group-hover:text-primary transition-colors">
              {artisan.firstName} {artisan.lastName}
            </h3>
            <p className="text-sm text-gray-600 font-medium truncate">{artisan.businessName}</p>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(artisan.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{artisan.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({artisan.totalReviews})</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-shrink-0">
            {artisan.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-0.5 font-medium">
                Verified
              </Badge>
            )}
            {artisan.availability.availableForLearning && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5 font-medium">
                Teaching
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 px-4">
        {/* Specializations */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {artisan.specialization.slice(0, 3).map((category: string, index: number) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20 font-medium"
              >
                {category}
              </Badge>
            ))}
            {artisan.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 text-gray-500 border-gray-300">
                +{artisan.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {artisan.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 py-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{artisan.experience}+ years</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{artisan.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>Portfolio: {artisan.portfolio.length}</span>
          </div>
        </div>

        {/* Portfolio Preview */}
        {artisan.portfolio.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">Portfolio</h4>
              <Link href={`/providers/${artisan.id}/portfolio`} className="text-xs text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {artisan.portfolio.slice(0, 3).map((item, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-full h-16 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex-shrink-0">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                ₦{artisan.pricing.serviceRate?.toLocaleString() || "Negotiable"}
              </span>
              <span className="text-xs text-gray-500">/ service</span>
            </div>
            {artisan.availability.availableForLearning && (
              <div className="text-right">
                <span className="text-sm font-semibold text-blue-600">
                  ₦{artisan.pricing.learningRate?.toLocaleString() || "Ask"}
                </span>
                <span className="text-xs text-gray-500 block">/ session</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Link href={`/providers/${artisan.id}`} className="flex-1">
              <Button variant="outline" className="w-full text-sm h-8 border-primary/20 text-primary hover:bg-primary/5">
                View Profile
              </Button>
            </Link>
            
            {user?.role === "student" && (
              <WhatsAppCTACompact
                provider={artisan}
                student={user as unknown as Student}
                className="flex-1"
              />
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}