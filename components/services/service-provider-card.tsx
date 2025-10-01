"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { VerificationBadge, QualityBadge, ExperienceBadge } from "@/components/ui/verification-badge"
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  Heart,
  Phone,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceProvider {
  id: string
  name: string
  businessName: string
  specialization: string[]
  location: string
  rating: number
  totalReviews: number
  verified: boolean
  availableForLearning: boolean
  responseTime: string
  portfolio: string[]
  pricing: {
    serviceRate?: number
    trainingRate?: number
  }
  experienceYears?: number
  avatar?: string
  bio?: string
}

interface ServiceProviderCardProps {
  provider: ServiceProvider
  onContact?: (providerId: string) => void
  onFavorite?: (providerId: string) => void
  isFavorited?: boolean
  className?: string
}

export function ServiceProviderCard({ 
  provider, 
  onContact, 
  onFavorite, 
  isFavorited = false,
  className 
}: ServiceProviderCardProps) {
  const [showContactModal, setShowContactModal] = useState(false)
  const [message, setMessage] = useState("")

  const handleContact = () => {
    if (onContact) {
      onContact(provider.id)
    }
    setShowContactModal(false)
    setMessage("")
  }

  const handleWhatsAppContact = () => {
    const phoneNumber = "2348123456789" // Would be from provider data
    const text = `Hi ${provider.name}, I'm interested in your ${provider.specialization[0]} services. Can we discuss more details?`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={provider.avatar || "/placeholder-user.jpg"} alt={provider.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {provider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{provider.name}</h3>
              <p className="text-sm text-gray-600">{provider.businessName}</p>
              <div className="flex items-center space-x-2 mt-1">
                <VerificationBadge verified={provider.verified} variant="compact" />
                {provider.rating >= 4.5 && provider.totalReviews >= 10 && (
                  <QualityBadge rating={provider.rating} totalReviews={provider.totalReviews} />
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFavorite?.(provider.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Specializations */}
        <div>
          <div className="flex flex-wrap gap-1">
            {provider.specialization.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {provider.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Rating and Location */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{provider.rating}</span>
            <span>({provider.totalReviews} reviews)</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{provider.location}</span>
          </div>
        </div>

        {/* Response Time */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{provider.responseTime}</span>
        </div>

        {/* Portfolio Preview */}
        {provider.portfolio.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Recent Work</p>
            <div className="grid grid-cols-3 gap-2">
              {provider.portfolio.slice(0, 3).map((image, index) => (
                <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image}
                    alt={`${provider.name} portfolio ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between text-sm">
          <div>
            {provider.pricing.serviceRate && (
              <p className="text-gray-600">
                Services from <span className="font-semibold text-green-600">₦{provider.pricing.serviceRate.toLocaleString()}</span>
              </p>
            )}
            {provider.pricing.trainingRate && provider.availableForLearning && (
              <p className="text-gray-600">
                Training from <span className="font-semibold text-blue-600">₦{provider.pricing.trainingRate.toLocaleString()}</span>
              </p>
            )}
          </div>
          {provider.experienceYears && (
            <ExperienceBadge experienceYears={provider.experienceYears} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact {provider.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder={`Hi ${provider.name}, I'm interested in your services...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleContact} className="flex-1">
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={handleWhatsAppContact} className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild>
            <Link href={`/artisans/${provider.id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>
        </div>

        {/* Services Available */}
        {provider.availableForLearning && (
          <div className="border-t pt-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Briefcase className="h-3 w-3 mr-1" />
              Available for Training
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ServiceProviderCard