import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Users, MessageCircle, CheckCircle } from "lucide-react"
import { WhatsAppCTACompact } from "@/components/providers/whatsapp-cta"
import { useAuth } from "@/contexts/auth-context"
import type { Artisan, Provider } from "@/lib/types"
import Link from "next/link"

interface ArtisanCardProps {
  artisan: Artisan | Provider
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const { user } = useAuth()
  const initials = `${artisan.firstName[0]}${artisan.lastName[0]}`
  
  // Convert to Provider type for WhatsApp CTA (backward compatibility)
  const provider: Provider = {
    ...artisan,
    role: "artisan",
    fullName: `${artisan.firstName} ${artisan.lastName}`,
    availability: {
      isAvailable: true,
      availableForWork: true,
      availableForLearning: true,
      responseTime: "Usually responds within 24 hours"
    },
    pricing: {
      baseRate: undefined,
      learningRate: undefined,
      currency: "NGN"
    },
    whatsappNumber: "+234" + Math.random().toString().slice(2, 13),
    verificationStatus: artisan.verified ? "approved" : "pending",
    verificationEvidence: []
  }

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
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
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
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5 font-medium">
              Available
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 px-4">
        {/* Skills */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {artisan.specialization.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1 bg-gray-50 text-gray-700 border-gray-200 hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                {skill}
              </Badge>
            ))}
            {artisan.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-100 text-gray-600">
                +{artisan.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">{artisan.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span>{artisan.experience} years experience</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span>{artisan.skills.length} skills offered</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 space-y-3 flex-shrink-0 bg-gray-50/50">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 text-xs font-medium hover:bg-primary hover:text-white transition-all duration-200" 
            asChild
          >
            <Link href={`/artisans/${artisan.id}`}>
              View Profile
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="h-9 text-xs font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200" 
            asChild
          >
            <Link href={`/artisans/${artisan.id}/skills`}>
              View Skills
            </Link>
          </Button>
        </div>
        
        {/* WhatsApp CTA - only show if user is logged in as student */}
        {user && user.role === "student" && (
          <WhatsAppCTACompact
            provider={provider}
            student={{
              ...user,
              role: "student" as const,
              firstName: user.firstName || "Student",
              lastName: user.lastName || "User",
              phone: user.phone || "",
              studentId: user.studentId || "default-student-id",
              department: user.department || "Computer Science",
              level: String(user.level || "300"),
              enrolledSkills: [],
              password: "",
              createdAt: new Date(),
              updatedAt: new Date()
            }}
            serviceType="direct_service"
            className="w-full bg-green-600 hover:bg-green-700 text-white h-9 text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
          />
        )}
      </CardFooter>
    </Card>
  )
}
