// WhatsApp CTA utility functions for provider contact

import type { Provider, Student } from './types'

export class WhatsAppService {
  /**
   * Generate WhatsApp URL for contacting a provider
   */
  static generateWhatsAppURL(
    provider: Provider,
    student: Student,
    serviceType: 'service_booking' | 'direct_service',
    serviceTitle?: string
  ): string {
    const message = this.generateMessage(provider, student, serviceType, serviceTitle)
    const encodedMessage = encodeURIComponent(message)
    
    // Clean phone number (remove non-digits except +)
    const cleanPhone = provider.whatsappNumber.replace(/[^\d+]/g, '')
    
    // Use web.whatsapp.com for desktop, wa.me for mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    
    if (isMobile) {
      return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    } else {
      return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`
    }
  }

  /**
   * Generate personalized message based on service type
   */
  private static generateMessage(
    provider: Provider,
    student: Student,
    serviceType: 'service_booking' | 'direct_service',
    serviceTitle?: string
  ): string {
    const studentName = student.fullName || `${student.firstName} ${student.lastName}`
    const providerName = provider.businessName || `${provider.firstName} ${provider.lastName}`
    
    if (serviceType === 'service_booking' && serviceTitle) {
      return `Hi ${providerName}! 👋

I'm ${studentName}, a student at UNILORIN. I found your profile on the Services Platform and I'm interested in booking "${serviceTitle}".

${provider.availability.availableForLearning ? 
  `I saw that you're available for services. Could you please share more details about:
- Service schedule and duration
- Service approach and process
- Pricing for the service` :
  `Could you please let me know if you're available for this service?`
}

I'm looking forward to working with you!

Best regards,
${studentName}
UNILORIN Student`
    } else {
      return `Hi ${providerName}! 👋

I'm ${studentName}, a student at UNILORIN. I found your profile on the Services Platform and I'm interested in your ${provider.specialization.join(', ')} services.

Could you please share more details about:
- Your availability
- Service offerings
- Pricing and timeline

Looking forward to working with you!

Best regards,
${studentName}
UNILORIN Student`
    }
  }

  /**
   * Track WhatsApp CTA usage for analytics
   */
  static async trackWhatsAppContact(
    studentId: string,
    providerId: string,
    serviceType: 'service_booking' | 'direct_service',
    serviceId?: string
  ): Promise<void> {
    try {
      // In a real implementation, this would call an API endpoint
      console.log('WhatsApp contact tracked:', {
        studentId,
        providerId,
        serviceType,
        serviceId,
        timestamp: new Date().toISOString()
      })
      
      // You can implement actual tracking here:
      // await fetch('/api/analytics/whatsapp-contact', {
      //   method: 'POST',
      //   body: JSON.stringify({ studentId, providerId, serviceType, serviceId })
      // })
    } catch (error) {
      console.error('Failed to track WhatsApp contact:', error)
    }
  }

  /**
   * Validate phone number format
   */
  static isValidWhatsAppNumber(phone: string): boolean {
    // Remove all non-digits except +
    const cleaned = phone.replace(/[^\d+]/g, '')
    
    // Should start with + and have 10-15 digits
    const phoneRegex = /^\+[1-9]\d{9,14}$/
    return phoneRegex.test(cleaned)
  }

  /**
   * Format phone number for display
   */
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '')
    
    if (!cleaned.startsWith('+')) {
      return `+234${cleaned}` // Assume Nigerian number if no country code
    }
    
    return cleaned
  }

  /**
   * Check if WhatsApp is available on current device
   */
  static isWhatsAppAvailable(): boolean {
    // Check if running in browser environment
    if (typeof window === 'undefined') return false
    
    // For mobile devices, check if WhatsApp app might be installed
    // Always return true for web as web.whatsapp.com is available
    return true
  }

  /**
   * Get appropriate WhatsApp icon based on device
   */
  static getWhatsAppIconUrl(): string {
    return "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
  }
}

// Utility hooks for React components
export const useWhatsApp = () => {
  const contactProvider = (
    provider: Provider,
    student: Student,
    serviceType: 'service_booking' | 'direct_service',
    serviceTitle?: string
  ) => {
    if (!WhatsAppService.isWhatsAppAvailable()) {
      alert('WhatsApp is not available on this device')
      return
    }

    if (!WhatsAppService.isValidWhatsAppNumber(provider.whatsappNumber)) {
      alert('Provider has not set up a valid WhatsApp number')
      return
    }

    // Track the contact attempt
    WhatsAppService.trackWhatsAppContact(
      student.id,
      provider.id,
      serviceType,
      serviceTitle ? 'service-based-contact' : undefined
    )

    // Generate and open WhatsApp URL
    const whatsappUrl = WhatsAppService.generateWhatsAppURL(
      provider,
      student,
      serviceType,
      serviceTitle
    )

    // Open in new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return {
    contactProvider,
    isWhatsAppAvailable: WhatsAppService.isWhatsAppAvailable(),
    validatePhone: WhatsAppService.isValidWhatsAppNumber,
    formatPhone: WhatsAppService.formatPhoneNumber
  }
}
