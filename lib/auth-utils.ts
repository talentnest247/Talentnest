import { supabaseAdmin } from "./supabase"
import { mockAPI } from "./mock-data"
const JWT_SECRET = process.env.JWT_SECRET || "unilorin-artisan-platform-jwt-secret-key-minimum-32-chars-2024"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  userType: "student" | "artisan" | "admin"
  role: "student" | "artisan" | "admin"
  studentId?: string
  department?: string
  level?: number
  phone?: string
  // Extended properties for marketplace functionality
  avatar_url?: string
  verification_status?: 'pending' | 'verified' | 'rejected'
  available_for_learning?: boolean
  availability_status?: 'online' | 'offline' | 'busy' | 'away'
  location_on_campus?: string
  hourly_rate?: number
  skills_offered?: string[]
  specializations?: string[]
  bio?: string
  experience_years?: number
  portfolio_url?: string
  social_links?: Record<string, string>
  rating?: number
  total_reviews?: number
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  // Generate a 16-byte salt. Prefer Web Crypto's getRandomValues if available,
  // otherwise fall back to Node's crypto.randomBytes.
  let salt: Uint8Array
  try {
    const getRandomValues = (typeof crypto !== 'undefined' && (crypto as unknown as { getRandomValues?: (arr: Uint8Array) => Uint8Array }).getRandomValues)
      ? (crypto as unknown as { getRandomValues?: (arr: Uint8Array) => Uint8Array }).getRandomValues
      : undefined

    if (getRandomValues) {
      salt = getRandomValues(new Uint8Array(16))
    } else {
      // dynamic import so bundlers don't rewrite in browser
      const { randomBytes } = await import('crypto')
      salt = Uint8Array.from(randomBytes(16))
    }
  } catch (err) {
    // As a last resort, create a (less secure) pseudo-random salt. This should
    // rarely happen; log for visibility.
    console.warn('[v0] Falling back to pseudo-random salt generation', err)
    salt = Uint8Array.from(Array.from({ length: 16 }, () => Math.floor(Math.random() * 256)))
  }
  const passwordData = encoder.encode(
    password +
      Array.from(salt)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
  )

  // Compute SHA-256 digest using SubtleCrypto when available, otherwise fall back to Node's crypto
  async function sha256(data: Uint8Array): Promise<Uint8Array> {
    try {
      const subtle = (typeof crypto !== 'undefined' && (crypto as unknown as { subtle?: SubtleCrypto }).subtle)
        ? (crypto as unknown as { subtle?: SubtleCrypto }).subtle
        : undefined
      if (subtle && typeof subtle.digest === 'function') {
  const buf = await subtle.digest('SHA-256', data.buffer as unknown as ArrayBuffer)
        return new Uint8Array(buf)
      }
    } catch {
      // fall through to Node fallback
    }

    // Node fallback
    try {
      const { createHash } = await import('crypto')
      const hash = createHash('sha256').update(Buffer.from(data)).digest()
      return new Uint8Array(hash)
    } catch {
      throw new Error('No available crypto implementation for SHA-256 digest')
    }
  }

  const hashBuffer = await sha256(passwordData)
  const hashArray = Array.from(hashBuffer)
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return `${saltHex}:${hashHex}`
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = hashedPassword.split(":")
    if (!saltHex || !hashHex) return false

    const encoder = new TextEncoder()
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const passwordData = encoder.encode(
      password + 
      Array.from(salt)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    )

    // Use the same sha256 helper as in hashPassword
    async function sha256(data: Uint8Array): Promise<Uint8Array> {
      try {
        const subtle = (typeof crypto !== 'undefined' && (crypto as unknown as { subtle?: SubtleCrypto }).subtle)
          ? (crypto as unknown as { subtle?: SubtleCrypto }).subtle
          : undefined
        if (subtle && typeof subtle.digest === 'function') {
    const buf = await subtle.digest('SHA-256', data.buffer as unknown as ArrayBuffer)
          return new Uint8Array(buf)
        }
      } catch {
        // fall through to Node fallback
      }

      try {
        const { createHash } = await import('crypto')
        const hash = createHash('sha256').update(Buffer.from(data)).digest()
        return new Uint8Array(hash)
      } catch {
        throw new Error('No available crypto implementation for SHA-256 digest')
      }
    }

    const hashBuffer = await sha256(passwordData)
    const hashArray = Array.from(hashBuffer)
    const computedHashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    return computedHashHex === hashHex
  } catch (error) {
    console.error("[v0] Password verification error:", error)
    return false
  }
}

// Simple base64 encoding/decoding for JWT-like tokens
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(str: string): string {
  str += "=".repeat((4 - (str.length % 4)) % 4)
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
}

// Web Crypto API compatible HMAC signature
async function createSignature(data: string, secret: string): Promise<string> {
  // Use Web Crypto if available (Node 18+ / browser). If not available,
  // fallback to Node's crypto module. Always return URL-safe Base64.
  try {
    // Prefer Web Crypto (SubtleCrypto) when available (Node 18+ or browser).
    const subtle = (typeof crypto !== 'undefined' && (crypto as unknown as { subtle?: SubtleCrypto }).subtle) ? (crypto as unknown as { subtle?: SubtleCrypto }).subtle : undefined
    if (subtle && typeof subtle.importKey === 'function') {
      const encoder = new TextEncoder()
      const keyData = encoder.encode(secret)
      const messageData = encoder.encode(data)
      // Use SubtleCrypto types directly
      const key = await subtle.importKey(
        'raw',
        keyData,
        // SubtleCrypto expects the hash to be an object: { name: 'SHA-256' }
        { name: 'HMAC', hash: { name: 'SHA-256' } } as HmacImportParams,
        false,
        ['sign'],
      )
      // Ensure the imported key is a CryptoKey (avoid implicit any) and sign using SubtleCrypto.
      // Return URL-safe base64 signature immediately so the Node fallback below is not reached.
      const cryptoKey = key as CryptoKey
      if (!cryptoKey) {
        throw new Error('Failed to import HMAC key (invalid CryptoKey)')
      }
      const sigBuffer = await (subtle as SubtleCrypto).sign('HMAC', cryptoKey, messageData)
      // Buffer may not be present in some runtimes; use a safe fallback
      let BufferLib: typeof Buffer
      try {
        BufferLib = (typeof Buffer !== 'undefined') ? Buffer : (await import('buffer')).Buffer
      } catch {
        // As a final fallback, convert via Uint8Array -> base64 manually. Prefer
        // `btoa` if available (browsers/Edge), otherwise dynamically import
        // `buffer` to produce the base64 string in Node-like runtimes.
        const arr = Array.from(new Uint8Array(sigBuffer))
        const binary = arr.map((b) => String.fromCharCode(b)).join('')
        if (typeof btoa === 'function') {
          const base64 = btoa(binary)
          return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
        }
        const { Buffer: Buf } = await import('buffer')
        const base64 = Buf.from(binary, 'binary').toString('base64')
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      }
      const base64 = BufferLib.from(new Uint8Array(sigBuffer)).toString('base64')
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }
  } catch {
    // fall through to Node crypto fallback
    console.warn('[v0] WebCrypto HMAC not available, falling back to Node crypto')
  }

  // Node crypto fallback (synchronous)
  try {
    // dynamic import so bundlers don't rewrite in browser
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = await import('crypto')
    const hmac = nodeCrypto.createHmac('sha256', secret)
    hmac.update(data)
    const base64 = hmac.digest('base64')
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch {
    throw new Error('No available crypto implementation for creating signature')
  }
}

export const authUtils = {
  async hashPassword(password: string): Promise<string> {
    return hashPassword(password)
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return verifyPassword(password, hashedPassword)
  },

  async generateToken(user: AuthUser): Promise<string> {
    try {
      const header = { alg: "HS256", typ: "JWT" }
      const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.role,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        level: user.level,
        phone: user.phone,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      }

      const encodedHeader = base64UrlEncode(JSON.stringify(header))
      const encodedPayload = base64UrlEncode(JSON.stringify(payload))
      const signature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)

      return `${encodedHeader}.${encodedPayload}.${signature}`
    } catch (error) {
      console.error("[v0] Token generation failed:", error)
      throw new Error("Failed to generate token")
    }
  },

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      if (!token || typeof token !== "string") {
        return null
      }

      const parts = token.split(".")
      if (parts.length !== 3) {
        return null
      }

      const [encodedHeader, encodedPayload, signature] = parts

      // Verify signature
      const expectedSignature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)
      if (signature !== expectedSignature) {
        console.log("[v0] Invalid token signature")
        return null
      }

      // Decode payload
      const payload = JSON.parse(base64UrlDecode(encodedPayload))

      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log("[v0] Token expired")
        return null
      }

      return {
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName || "",
        firstName: payload.firstName,
        lastName: payload.lastName,
        userType: payload.userType,
        role: payload.role || payload.userType, // Support both fields
        studentId: payload.studentId,
        department: payload.department,
        level: payload.level,
        phone: payload.phone,
      }
    } catch (error) {
      console.log("[v0] JWT verification failed:", error)
      return null
    }
  },

  async getUserById(id: string): Promise<AuthUser | null> {
    try {
      // Try Supabase first, fallback to mock data
      if (!supabaseAdmin) {
        console.warn("Using mock data - supabaseAdmin not available")
        const mockUser = await mockAPI.getUserById(id)
        if (mockUser) {
          return {
            id: mockUser.id,
            email: mockUser.email,
            fullName: mockUser.fullName,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            userType: mockUser.role,
            role: mockUser.role,
            studentId: mockUser.studentId,
            department: mockUser.department,
            level: typeof mockUser.level === 'number' ? mockUser.level : undefined,
            phone: mockUser.phone,
          }
        }
        return null
      }

      try {
        // Query the users table
        const { data, error } = await supabaseAdmin
          .from('users')
          .select('id, email, full_name, first_name, last_name, role, phone, student_id, department, level')
          .eq('id', id)
          .single()
        
        if (error) {
          console.error("Supabase error fetching user by id:", error)
          // Fallback to mock data if Supabase fails
          console.warn("Falling back to mock data due to database error")
          const mockUser = await mockAPI.getUserById(id)
          if (mockUser) {
            return {
              id: mockUser.id,
              email: mockUser.email,
              fullName: mockUser.fullName,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              userType: mockUser.role,
              role: mockUser.role,
              studentId: mockUser.studentId,
              department: mockUser.department,
              level: typeof mockUser.level === 'number' ? mockUser.level : undefined,
              phone: mockUser.phone,
            }
          }
          return null
        }
        
        if (!data) return null

        return {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          firstName: data.first_name,
          lastName: data.last_name,
          userType: data.role,
          role: data.role,
          studentId: data.student_id ?? undefined,
          department: data.department ?? undefined,
          level: data.level ? parseInt(data.level) : undefined,
          phone: data.phone ?? undefined,
        }
      } catch (supabaseError) {
        console.error("Supabase connection error:", supabaseError)
        // Fallback to mock data if Supabase fails completely
        console.warn("Falling back to mock data due to connection error")
        const mockUser = await mockAPI.getUserById(id)
        if (mockUser) {
          return {
            id: mockUser.id,
            email: mockUser.email,
            fullName: mockUser.fullName,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            userType: mockUser.role,
            role: mockUser.role,
            studentId: mockUser.studentId,
            department: mockUser.department,
            level: typeof mockUser.level === 'number' ? mockUser.level : undefined,
            phone: mockUser.phone,
          }
        }
        return null
      }
    } catch (error) {
      console.error("Error fetching user by id:", error)
      return null
    }
  },

  async getUserByEmail(email: string): Promise<(AuthUser & { password: string }) | null> {
    try {
      // Try Supabase first, fallback to mock data
      if (!supabaseAdmin) {
        console.warn("Using mock data - supabaseAdmin not available")
        const mockUser = await mockAPI.getUserByEmail(email)
        if (mockUser) {
          return {
            id: mockUser.id,
            email: mockUser.email,
            fullName: mockUser.fullName,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            userType: mockUser.role,
            role: mockUser.role,
            studentId: mockUser.studentId,
            department: mockUser.department,
            level: typeof mockUser.level === 'number' ? mockUser.level : undefined,
            phone: mockUser.phone,
            password: mockUser.password || '',
          }
        }
        return null
      }

      const normalizedEmail = String(email).trim().toLowerCase()
      console.log("Searching for user with email:", normalizedEmail)
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, email, full_name, first_name, last_name, role, phone, student_id, department, level')
        .eq('email', normalizedEmail)
        .single()
      
      if (error) {
        // PostgREST returns PGRST116 when no rows match a .single() query.
        // Treat that as "not found" without noisy logging.
        const errObj = error as unknown as { code?: string }
        if (errObj.code === 'PGRST116') {
          // continue to check auth.users below
        } else {
          console.error("Supabase error fetching user:", error)
          return null
        }
      }
      
      if (!data) {
        console.log("No profile found with email in profiles table:", email)
        // Check auth.users for a user created in Supabase Auth but without a profile
        try {
          // Use the Supabase Admin auth API to list users and find a matching email.
          // Some projects do not expose `auth.users` via PostgREST, so use the admin SDK.
          type AdminUser = { id: string; email?: string }
          type AdminApi = {
            listUsers?: (params: { perPage?: number; page?: number }) => Promise<{ data?: { users?: AdminUser[] } | AdminUser[] }>
          }

          const adminAuth = (supabaseAdmin as unknown as { auth?: unknown }).auth as unknown
          const adminApi = adminAuth as unknown as AdminApi
          if (adminApi && typeof adminApi.listUsers === 'function') {
            // Page through admin users to find a matching email to avoid missing users on later pages.
            const perPage = 200
            const maxPages = 20 // search up to perPage * maxPages users
            for (let page = 1; page <= maxPages; page++) {
              try {
                const res = await adminApi.listUsers({ perPage, page })
                const usersList = (res as unknown as { data?: { users?: AdminUser[] } | AdminUser[] })?.data || []
                const found = (usersList as AdminUser[]).find((u) => typeof u?.email === 'string' && u.email!.toLowerCase() === normalizedEmail)
                if (found) {
                  console.log(`Found auth-only user via admin API for email on page ${page}:`, normalizedEmail)
                  return {
                    id: found.id,
                    // Coerce possibly-undefined email to the normalized email string
                    email: found.email ?? normalizedEmail,
                    fullName: '',
                    firstName: undefined,
                    lastName: undefined,
                    userType: 'student',
                    role: 'student',
                    phone: undefined,
                    password: ''
                  }
                }
                // If fewer users returned than perPage, no more pages to check
                const listLength = Array.isArray(usersList) ? usersList.length : 0
                if (listLength < perPage) break
              } catch (pageErr) {
                console.error('Error paging admin users list:', pageErr)
                break
              }
            }
          } else {
            // Fallback: try querying `auth.users` via PostgREST (may not be available)
            const { data: authUser } = await supabaseAdmin
              .from('auth.users')
              .select('id, email')
              .eq('email', normalizedEmail)
              .single()
            if (authUser) {
              console.log('Found auth-only user in auth.users for email:', normalizedEmail)
              return {
                id: authUser.id,
                email: authUser.email ?? normalizedEmail,
                fullName: '',
                firstName: undefined,
                lastName: undefined,
                userType: 'student',
                role: 'student',
                phone: undefined,
                password: ''
              }
            }
          }
        } catch (_err) {
          console.error('Error checking auth users for email (admin list fallback):', _err)
        }

        console.log("No user found with email in Supabase:", email)
        
        // Fallback to mock data
        console.log("Checking mock data for email:", email)
        const mockUser = await mockAPI.getUserByEmail(email)
        if (mockUser) {
          console.log("Found user in mock data:", mockUser.email)
          return {
            id: mockUser.id,
            email: mockUser.email,
            fullName: mockUser.fullName,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            userType: mockUser.role,
            role: mockUser.role,
            studentId: mockUser.studentId,
            department: mockUser.department,
            level: typeof mockUser.level === 'number' ? mockUser.level : undefined,
            phone: mockUser.phone,
            password: mockUser.password || '',
          }
        }
        
        return null
      }

      console.log("User found:", { id: data.id, email: data.email, role: data.role })

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        firstName: data.first_name,
        lastName: data.last_name,
        userType: data.role,
        role: data.role,
        studentId: data.student_id ?? undefined,
        department: data.department ?? undefined,
        level: data.level ? parseInt(data.level) : undefined,
        phone: data.phone ?? undefined,
        password: '', // Password not stored in users table
      }
    } catch (error) {
      console.error("Error fetching user by email from Supabase:", error)
      
      // Fallback to mock data on any error
      console.log("Falling back to mock data due to error for email:", email)
      try {
        const mockUser = await mockAPI.getUserByEmail(email)
        if (mockUser) {
          console.log("Found user in mock data fallback:", mockUser.email)
          return {
            id: mockUser.id,
            email: mockUser.email,
            fullName: mockUser.fullName,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            userType: mockUser.role,
            role: mockUser.role,
            studentId: mockUser.studentId,
            department: mockUser.department,
            level: typeof mockUser.level === 'number' ? mockUser.level : undefined,
            phone: mockUser.phone,
            password: mockUser.password || '',
          }
        }
      } catch (mockError) {
        console.error("Error accessing mock data:", mockError)
      }
      
      return null
    }
  },

  async createUser(user: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    fullName: string,
    phone: string,
    role: "student" | "artisan",
    studentId?: string,
    department?: string,
    level?: string,
  }): Promise<AuthUser | null> {
    try {
      // Try Supabase first, fallback to mock data
      if (!supabaseAdmin) {
        console.warn("Using mock data - supabaseAdmin not available")
        const mockUser = await mockAPI.createUser({
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          full_name: user.fullName,
          phone: user.phone,
          role: user.role,
          student_id: user.studentId,
          department: user.department,
          level: user.level ? Number(user.level) : undefined,
          password: user.password
        })
        
        return {
          id: mockUser.id,
          email: user.email,
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.role,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          level: user.level ? Number(user.level) : undefined,
          phone: user.phone,
        }
      }

      // Use Supabase Auth to create user
      console.log("Creating user with Supabase Auth:", user.email)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role
        }
      })

      if (authError) {
        // Avoid printing the entire SDK error (stack) which is noisy for expected cases
        const authErrObj = authError as unknown as Record<string, unknown>
        const errMessage = typeof authErrObj.message === 'string' ? authErrObj.message : 'Supabase auth error'
        const err = new Error(errMessage) as Error & { code?: string }
        if (typeof authErrObj.code === 'string') {
          err.code = authErrObj.code
        } else if (typeof authErrObj.status === 'string') {
          err.code = authErrObj.status
        } else {
          err.code = 'auth_error'
        }
        throw err
      }

      if (!authData.user) {
        console.error("No user data returned from auth")
        return null
      }

      // Profile will be created automatically by trigger
      console.log("User created successfully:", authData.user.id)
      
      // Create student record if role is student
      if (user.role === 'student' && user.studentId) {
        const { error: studentError } = await supabaseAdmin
          .from('students')
          .insert([{
            user_id: authData.user.id,
            student_id: user.studentId,
            department: user.department,
            level: Number(user.level) || null
          }])

        if (studentError) {
          console.error("Error creating student record:", studentError)
        }
      }

      return {
        id: authData.user.id,
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.role,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        level: user.level ? Number(user.level) : undefined,
        phone: user.phone,
      }
    } catch (error) {
      console.error("Error creating user:", error)
      // Surface the error to callers so they can respond appropriately
      throw error
    }
  },

  async createProvider(providerData: {
    user_id: string,
    business_name: string,
    description: string,
    bio?: string | null,
    specialization: string[],
    experience: number,
    location: string,
    certificates?: string[],
    verification_status?: 'pending' | 'approved' | 'rejected',
    verified?: boolean,
    rating?: number,
    total_reviews?: number,
    verification_evidence?: string[],
    availability_is_available?: boolean,
    availability_available_for_work?: boolean,
    availability_available_for_learning?: boolean,
    availability_response_time?: string,
    pricing_base_rate?: number | null,
    pricing_learning_rate?: number | null,
    pricing_currency?: string,
  }): Promise<{ id: string } | null> {
    try {
      if (!supabaseAdmin) {
        console.error("Supabase admin client not available")
        return null
      }

      console.log("Creating provider profile:", providerData.business_name)

      const { data, error } = await supabaseAdmin
        .from('artisans')
        .insert([providerData])
        .select('id')
        .single()

      if (error) {
        console.error("Supabase provider insert error:", error)
        return null
      }

      if (!data) {
        console.error("No data returned from provider insert")
        return null
      }

      console.log("Provider created successfully:", data.id)
      return { id: data.id }
    } catch (error) {
      console.error("Error creating provider:", error)
      return null
    }
  },
}

// Export standalone functions for easier import
export const verifyToken = authUtils.verifyToken.bind(authUtils)
export const getUserById = authUtils.getUserById.bind(authUtils)
export const getUserByEmail = authUtils.getUserByEmail.bind(authUtils)
export const createUser = authUtils.createUser.bind(authUtils)
export const createProvider = authUtils.createProvider.bind(authUtils)

// Helper function to extract and verify token from request
export async function authenticateRequest(request: { headers: Headers }): Promise<{ valid: boolean; payload?: AuthUser; error?: string }> {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'No valid authorization header' }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const payload = await verifyToken(token)
    
    if (!payload) {
      return { valid: false, error: 'Invalid or expired token' }
    }

    return { valid: true, payload }
  } catch {
    return { valid: false, error: 'Authentication failed' }
  }
}
