// Validation utilities for forms and user data

export const validateMatricNumber = (matricNumber: string): boolean => {
  // Format: XX-XXhlXXX (e.g., 20-52hl077) - Optional for artisans
  const matricRegex = /^\d{2}-\d{2}hl\d{3}$/i
  return matricRegex.test(matricNumber)
}

export const generateEmailFromMatric = (matricNumber: string): string => {
  return `${matricNumber.toLowerCase()}@students.unilorin.edu.ng`
}

export const validateEmail = (email: string): boolean => {
  // Accept any valid email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
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
export const studentSignupValidation = {
  matricNumber: (value: string) => {
    if (!value) return "Matric number is required"
    if (!validateMatricNumber(value)) return "Invalid matric number format (e.g., 20-52hl077)"
    return null
  },

  email: (value: string) => {
    if (!value) return "Email is required"
    if (!validateEmail(value)) return "Please enter a valid email address"
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

  faculty: (value: string) => {
    if (!value) return "Faculty is required"
    return null
  },

  department: (value: string) => {
    if (!value) return "Department is required"
    return null
  },

  level: (value: string) => {
    if (!value) return "Level is required"
    return null
  }
}

export const artisanSignupValidation = {
  email: (value: string) => {
    if (!value) return "Email is required"
    if (!validateEmail(value)) return "Please enter a valid email address"
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

  bio: (value: string) => {
    if (!value) return "Bio is required"
    if (value.length < 50) return "Bio must be at least 50 characters"
    return null
  },

  experience: (value: string) => {
    if (!value) return "Experience description is required"
    if (value.length < 30) return "Experience must be at least 30 characters"
    return null
  },

  skills: (value: string[]) => {
    if (!value || value.length === 0) return "At least one skill is required"
    return null
  },

  password: (value: string) => {
    if (!value) return "Password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    return null
  },
}
