"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, ExternalLink, Clock, CheckCircle } from "lucide-react"
import { useWhatsApp } from "@/lib/whatsapp"
import type { Provider, Student } from "@/lib/types"

interface WhatsAppCTAProps {
  provider: Provider
  student: Student
  serviceType?: "skill_learning" | "direct_service"
  skillTitle?: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  className?: string
  showPreview?: boolean
}

export function WhatsAppCTA({
  provider,
  student,
  serviceType = "direct_service",
  skillTitle,
  variant = "default",
  size = "default",
  className = "",
  showPreview = true
}: WhatsAppCTAProps) {
  const { contactProvider, isWhatsAppAvailable } = useWhatsApp()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  const handleDirectContact = () => {
    contactProvider(provider, student, serviceType, skillTitle)
  }

  const handleContactWithCustomMessage = () => {
    // If custom message is provided, we'd need to modify the WhatsApp service
    // For now, just use the standard contact
    contactProvider(provider, student, serviceType, skillTitle)
    setIsDialogOpen(false)
  }

  const getButtonText = () => {
    if (serviceType === "skill_learning" && skillTitle) {
      return `Learn ${skillTitle}`
    }
    return `Contact ${provider.businessName || provider.firstName}`
  }

  const getProviderStatus = () => {
    if (!provider.availability?.isAvailable) {
      return { text: "Currently Unavailable", color: "destructive" as const }
    }
    
    if (serviceType === "skill_learning" && !provider.availability?.availableForLearning) {
      return { text: "Not Teaching Currently", color: "secondary" as const }
    }
    
    return { text: "Available", color: "default" as const }
  }

  if (!isWhatsAppAvailable) {
    return (
      <Button disabled variant="outline" className={className}>
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp Not Available
      </Button>
    )
  }

  const status = getProviderStatus()

  return (
    <div className="space-y-3">
      {/* Status indicators */}
      <div className="flex items-center gap-2 text-sm">
        <Badge variant={status.color} className="flex items-center gap-1">
          {status.color === "default" && <CheckCircle className="h-3 w-3" />}
          {status.text}
        </Badge>
        
        {provider.availability?.responseTime && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {provider.availability.responseTime}
          </Badge>
        )}
        
        {serviceType === "skill_learning" && provider.availability?.availableForLearning && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Available for Teaching
          </Badge>
        )}
      </div>

      {/* Main CTA buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleDirectContact}
          variant={variant}
          size={size}
          className={`flex-1 ${className}`}
          disabled={!provider.availability?.isAvailable || 
                   (serviceType === "skill_learning" && !provider.availability?.availableForLearning)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {getButtonText()}
          <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
        </Button>

        {showPreview && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size={size}>
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Contact Preview</DialogTitle>
                <DialogDescription>
                  Preview the message that will be sent to {provider.businessName || provider.firstName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Message</Label>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p className="whitespace-pre-wrap">
                      {`Hi ${provider.businessName || provider.firstName}! 👋

I'm ${student.fullName || `${student.firstName} ${student.lastName}`}, a student at UNILORIN. I found your profile on the Artisan Platform and I'm interested in ${serviceType === "skill_learning" && skillTitle ? `learning "${skillTitle}"` : `your ${provider.specialization?.join(", ")} services`}.

${serviceType === "skill_learning" && skillTitle ?
  provider.availability?.availableForLearning ?
    `I saw that you're available for teaching. Could you please share more details about:
- Training schedule and duration  
- Learning approach and materials
- Pricing for the training sessions` :
    `Could you please let me know if you're available to teach this skill?`
  :
  `Could you please share more details about:
- Your availability
- Service offerings  
- Pricing and timeline`
}

Looking forward to ${serviceType === "skill_learning" ? "learning from your expertise" : "working with you"}!

Best regards,
${student.fullName || `${student.firstName} ${student.lastName}`}
UNILORIN Student`}
                    </p>
                  </div>
                </div>

                {/* Custom message option - future enhancement */}
                <div className="space-y-2">
                  <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                  <Textarea
                    id="custom-message"
                    placeholder="Add any specific details or questions..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleContactWithCustomMessage}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send via WhatsApp
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Pricing info */}
      {provider.pricing && (serviceType === "skill_learning" ? 
        provider.pricing.learningRate : 
        provider.pricing.baseRate) && (
        <div className="text-sm text-muted-foreground">
          Starting from ₦{(serviceType === "skill_learning" ? 
            provider.pricing.learningRate : 
            provider.pricing.baseRate)?.toLocaleString()}
          {serviceType === "skill_learning" ? " per session" : " per project"}
        </div>
      )}
    </div>
  )
}

// Simplified version for compact spaces
export function WhatsAppCTACompact({
  provider,
  student,
  serviceType = "direct_service",
  skillTitle,
  className = ""
}: Omit<WhatsAppCTAProps, "showPreview" | "variant" | "size">) {
  const { contactProvider, isWhatsAppAvailable } = useWhatsApp()

  if (!isWhatsAppAvailable || !provider.availability?.isAvailable) {
    return null
  }

  return (
    <Button
      onClick={() => contactProvider(provider, student, serviceType, skillTitle)}
      size="sm"
      className={`w-full flex items-center justify-center gap-1 sm:gap-2 ${className}`}
      disabled={serviceType === "skill_learning" && !provider.availability?.availableForLearning}
    >
      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
      <span className="text-xs sm:text-sm font-medium">Contact</span>
    </Button>
  )
}
