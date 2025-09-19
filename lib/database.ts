import { mockSql } from "./mock-database"
import type { Provider, VerificationRequest, ContactRequest, User } from "./types"

const sql = mockSql

export { sql }

// Database utility functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Mock implementation - in real app this would execute the query
    console.log("[v0] Mock query:", query, params)
    return { success: true, data: [] }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// User management functions
export async function createUser(userData: {
  email: string
  name: string
  password_hash: string
  role: "student" | "artisan"
  phone?: string
  location?: string
  bio?: string
}) {
  const query = `
    INSERT INTO users (email, name, password_hash, role, phone, location, bio)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, email, name, role, phone, location, bio, created_at
  `

  return executeQuery(query, [
    userData.email,
    userData.name,
    userData.password_hash,
    userData.role,
    userData.phone || null,
    userData.location || null,
    userData.bio || null,
  ])
}

export async function getUserByEmail(email: string) {
  const query = `
    SELECT id, email, name, password_hash, role, phone, location, bio, created_at
    FROM users 
    WHERE email = $1
  `

  const result = await executeQuery(query, [email])
  return result.success && result.data && result.data.length > 0 ? result.data[0] : null
}

export async function getUserById(id: string) {
  const query = `
    SELECT id, email, name, role, phone, location, bio, created_at
    FROM users 
    WHERE id = $1
  `

  const result = await executeQuery(query, [id])
  return result.success && result.data && result.data.length > 0 ? result.data[0] : null
}

// Skills management functions
export async function getAllSkills() {
  const query = `
    SELECT s.*, 
           COUNT(DISTINCT as_table.artisan_id) as artisan_count,
           COUNT(DISTINCT e.id) as enrollment_count
    FROM skills s
    LEFT JOIN artisan_skills as_table ON s.id = as_table.skill_id
    LEFT JOIN enrollments e ON s.id = e.skill_id
    GROUP BY s.id
    ORDER BY s.name
  `

  const result = await executeQuery(query)
  return result.success ? result.data : []
}

export async function getSkillById(id: string) {
  const query = `
    SELECT s.*,
           COUNT(DISTINCT as_table.artisan_id) as artisan_count,
           COUNT(DISTINCT e.id) as enrollment_count
    FROM skills s
    LEFT JOIN artisan_skills as_table ON s.id = as_table.skill_id
    LEFT JOIN enrollments e ON s.id = e.skill_id
    WHERE s.id = $1
    GROUP BY s.id
  `

  const result = await executeQuery(query, [id])
  return result.success && result.data && result.data.length > 0 ? result.data[0] : null
}

// Artisan management functions
export async function getAllArtisans() {
  const query = `
    SELECT ap.*, u.name, u.email, u.phone, u.location, u.bio,
           array_agg(DISTINCT s.name) as skills
    FROM artisan_profiles ap
    JOIN users u ON ap.user_id = u.id
    LEFT JOIN artisan_skills as_table ON ap.id = as_table.artisan_id
    LEFT JOIN skills s ON as_table.skill_id = s.id
    GROUP BY ap.id, u.id
    ORDER BY ap.rating DESC, ap.total_reviews DESC
  `

  const result = await executeQuery(query)
  return result.success ? result.data : []
}

export async function getArtisanById(id: string) {
  const query = `
    SELECT ap.*, u.name, u.email, u.phone, u.location, u.bio
    FROM artisan_profiles ap
    JOIN users u ON ap.user_id = u.id
    WHERE ap.id = $1
  `

  const result = await executeQuery(query, [id])
  return result.success && result.data && result.data.length > 0 ? result.data[0] : null
}

export async function getArtisanSkills(artisanId: string) {
  const query = `
    SELECT s.*, as_table.proficiency_level
    FROM skills s
    JOIN artisan_skills as_table ON s.id = as_table.skill_id
    WHERE as_table.artisan_id = $1
    ORDER BY s.name
  `

  const result = await executeQuery(query, [artisanId])
  return result.success ? result.data : []
}

// Enrollment management functions
export async function createEnrollment(enrollmentData: {
  student_id: string
  provider_id: string
  skill_id: string
}) {
  const query = `
    INSERT INTO enrollments (student_id, provider_id, skill_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `

  return executeQuery(query, [enrollmentData.student_id, enrollmentData.provider_id, enrollmentData.skill_id])
}

export async function getUserEnrollments(userId: string) {
  const query = `
    SELECT e.*, s.name as skill_name, s.description as skill_description,
           pp.business_name, u.full_name as provider_name
    FROM enrollments e
    JOIN skills s ON e.skill_id = s.id
    JOIN provider_profiles pp ON e.provider_id = pp.id
    JOIN users u ON pp.user_id = u.id
    WHERE e.student_id = $1
    ORDER BY e.created_at DESC
  `

  const result = await executeQuery(query, [userId])
  return result.success ? result.data : []
}

// Provider management functions
export async function createProvider(providerData: {
  userId: string
  businessName: string
  description: string
  specialization: string[]
  whatsappNumber?: string
  availability: Provider['availability']
  pricing: Provider['pricing']
  verificationEvidence: any[]
  experience?: number
}) {
  const query = `
    INSERT INTO provider_profiles (
      user_id, business_name, description, specializations, whatsapp_number,
      availability, pricing, verification_evidence, experience_years
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `

  return executeQuery(query, [
    providerData.userId,
    providerData.businessName,
    providerData.description,
    JSON.stringify(providerData.specialization),
    providerData.whatsappNumber,
    JSON.stringify(providerData.availability),
    JSON.stringify(providerData.pricing),
    JSON.stringify(providerData.verificationEvidence),
    providerData.experience || 0
  ])
}

export async function getProviderById(providerId: string) {
  const query = `
    SELECT pp.*, u.email, u.full_name, u.student_id, u.department, u.phone, u.location, u.bio
    FROM provider_profiles pp
    JOIN users u ON pp.user_id = u.id
    WHERE pp.id = $1
  `

  const result = await executeQuery(query, [providerId])
  return result.success && result.data && result.data.length > 0 ? result.data[0] : null
}

export async function getAllProviders(filters?: {
  specialization?: string
  verificationStatus?: string
  availability?: boolean
}) {
  let query = `
    SELECT pp.*, u.email, u.full_name, u.student_id, u.department, u.phone, u.location, u.bio
    FROM provider_profiles pp
    JOIN users u ON pp.user_id = u.id
    WHERE 1=1
  `
  const params: any[] = []

  if (filters?.specialization) {
    query += ` AND $${params.length + 1} = ANY(pp.specializations)`
    params.push(filters.specialization)
  }

  if (filters?.verificationStatus) {
    query += ` AND pp.verification_status = $${params.length + 1}`
    params.push(filters.verificationStatus)
  }

  if (filters?.availability) {
    query += ` AND (pp.availability->>'isAvailable')::boolean = true`
  }

  query += ` ORDER BY pp.created_at DESC`

  const result = await executeQuery(query, params)
  return result.success ? result.data || [] : []
}

export async function updateProviderVerification(
  providerId: string, 
  status: 'approved' | 'rejected', 
  adminId: string, 
  notes?: string
) {
  const query = `
    UPDATE provider_profiles 
    SET verification_status = $1, verified_at = NOW(), verified_by = $2
    WHERE id = $3
    RETURNING *
  `

  const updateResult = await executeQuery(query, [status, adminId, providerId])

  // Also update the verification request
  if (updateResult.success) {
    const requestQuery = `
      UPDATE verification_requests
      SET status = $1, reviewed_at = NOW(), reviewed_by = $2, admin_notes = $3
      WHERE provider_id = $4
    `
    await executeQuery(requestQuery, [status, adminId, notes || null, providerId])
  }

  return updateResult
}

// Verification request functions
export async function getVerificationRequests(status?: string) {
  let query = `
    SELECT vr.*, pp.business_name as current_business_name
    FROM verification_requests vr
    LEFT JOIN provider_profiles pp ON vr.provider_id = pp.id
  `
  const params: any[] = []

  if (status && status !== 'all') {
    query += ` WHERE vr.status = $${params.length + 1}`
    params.push(status)
  }

  query += ` ORDER BY vr.submitted_at DESC`

  const result = await executeQuery(query, params)
  return result.success ? result.data : []
}

export async function getVerificationRequestById(requestId: string): Promise<VerificationRequest | null> {
  const query = `
    SELECT vr.*, pp.business_name as current_business_name
    FROM verification_requests vr
    LEFT JOIN provider_profiles pp ON vr.provider_id = pp.id
    WHERE vr.id = $1
  `

  const result = await executeQuery(query, [requestId])
  return result.success && result.data && result.data.length > 0 ? result.data[0] as VerificationRequest : null
}

// Contact request functions
export async function createContactRequest(contactData: {
  studentId: string
  providerId: string
  serviceType: 'direct_service' | 'skill_learning'
  contactMethod?: string
  messagePreview?: string
}) {
  const query = `
    INSERT INTO contact_requests (
      student_id, provider_id, service_type, contact_method, message_preview
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `

  return executeQuery(query, [
    contactData.studentId,
    contactData.providerId,
    contactData.serviceType,
    contactData.contactMethod || 'whatsapp',
    contactData.messagePreview
  ])
}

export async function getContactRequests(providerId?: string, studentId?: string) {
  let query = `
    SELECT cr.*, 
           pp.business_name, 
           u_student.full_name as student_name,
           u_provider.full_name as provider_name
    FROM contact_requests cr
    JOIN provider_profiles pp ON cr.provider_id = pp.id
    JOIN users u_student ON cr.student_id = u_student.id
    JOIN users u_provider ON pp.user_id = u_provider.id
    WHERE 1=1
  `
  const params: any[] = []

  if (providerId) {
    query += ` AND cr.provider_id = $${params.length + 1}`
    params.push(providerId)
  }

  if (studentId) {
    query += ` AND cr.student_id = $${params.length + 1}`
    params.push(studentId)
  }

  query += ` ORDER BY cr.contacted_at DESC`

  const result = await executeQuery(query, params)
  return result.success ? result.data || [] : []
}

export async function updateContactResponse(
  contactId: string, 
  responseReceived: boolean, 
  responseTimeHours?: number
) {
  const query = `
    UPDATE contact_requests 
    SET response_received = $1, response_time_hours = $2
    WHERE id = $3
    RETURNING *
  `

  return executeQuery(query, [responseReceived, responseTimeHours || null, contactId])
}

// Analytics functions
export async function getPlatformStats() {
  const query = `
    SELECT * FROM platform_stats
  `

  const result = await executeQuery(query, [])
  return result.success && result.data && result.data.length > 0 ? result.data[0] : null
}
