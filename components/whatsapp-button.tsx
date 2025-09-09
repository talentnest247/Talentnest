"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  children?: React.ReactNode
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi! I'd like to discuss a service with you.",
  className = "",
  size = "default",
  variant = "default",
  children,
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, "")
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button onClick={handleWhatsAppClick} className={className} size={size} variant={variant}>
      <MessageCircle className="w-4 h-4 mr-2" />
      {children || "WhatsApp"}
    </Button>
  )
}
