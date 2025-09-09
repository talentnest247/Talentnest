// Validation utilities for UNILORIN matric numbers and forms

export const validateMatricNumber = (matricNumber: string): boolean => {
  // Format: XX-XXhlXXX (e.g., 20-52hl077)
  const matricRegex = /^\d{2}-\d{2}hl\d{3}$/i
  return matricRegex.test(matricNumber)
}

export const generateEmailFromMatric = (matricNumber: string): string => {
  return `${matricNumber.toLowerCase()}@students.unilorin.edu.ng`
}

export const validateUnilorinEmail = (email: string): boolean => {
  const emailRegex = /^\d{2}-\d{2}hl\d{3}@students\.unilorin\.edu\.ng$/i
  return emailRegex.test(email)
}

export const extractMatricFromEmail = (email: string): string => {
  const match = email.match(/^(\d{2}-\d{2}hl\d{3})@students\.unilorin\.edu\.ng$/i)
  return match ? match[1] : ""
}

export const validatePhoneNumber = (phone: string): boolean => {
  // Nigerian phone number format
  const phoneRegex = /^(\+234|0)[789]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove spaces and format consistently
  const cleaned = phone.replace(/\s/g, "")
  if (cleaned.startsWith("0")) {
    return "+234" + cleaned.slice(1)
  }
  return cleaned.startsWith("+234") ? cleaned : "+234" + cleaned
}

// Form validation schemas
export const signupValidation = {
  matricNumber: (value: string) => {
    if (!value) return "Matric number is required"
    if (!validateMatricNumber(value)) return "Invalid matric number format (e.g., 20-52hl077)"
    return null
  },

  email: (value: string) => {
    if (!value) return "Email is required"
    if (!validateUnilorinEmail(value)) return "Must use your UNILORIN student email"
    return null
  },

  fullName: (value: string) => {
    if (!value) return "Full name is required"
    if (value.length < 2) return "Full name must be at least 2 characters"
    return null
  },

  phoneNumber: (value: string) => {
    if (!value) return "Phone number is required"
    if (!validatePhoneNumber(value)) return "Invalid Nigerian phone number"
    return null
  },

  password: (value: string) => {
    if (!value) return "Password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    return null
  },
}
