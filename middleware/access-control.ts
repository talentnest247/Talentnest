import { NextRequest, NextResponse } from 'next/server'
import { authUtils } from '@/lib/auth-utils'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile', 
  '/services',
  '/settings',
  '/api/enrollments',
  '/api/reviews',
  '/api/bookings',
  '/api/auth/me',
  '/api/auth/update-profile'
]

// Routes that require specific roles
const ROLE_RESTRICTED_ROUTES = {
  '/admin': ['admin'],
  '/api/admin': ['admin'],
  '/providers/dashboard': ['artisan'],
  '/api/artisans': ['artisan', 'admin']
}

export async function checkAccess(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl
  
  // Check if route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )
  
  if (!requiresAuth) {
    return null // Allow access
  }
  
  // Get auth token from cookies or headers
  const token = request.cookies.get('auth-token')?.value || 
    request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    // Redirect to login for page routes, return 401 for API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  try {
    const user = await authUtils.verifyToken(token)
    
    if (!user) {
      throw new Error('Invalid token')
    }
    
    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(ROLE_RESTRICTED_ROUTES)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(user.role)) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
    
    // Add user info to request headers for API routes
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.next()
      response.headers.set('x-user-id', user.id)
      response.headers.set('x-user-role', user.role)
      response.headers.set('x-user-email', user.email)
      return response
    }
    
    return null // Allow access
    
  } catch (error) {
    console.error('Auth verification failed:', error)
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
}