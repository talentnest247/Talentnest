import { NextResponse, type NextRequest } from "next/server"
import { checkAccess } from './middleware/access-control'

export async function middleware(request: NextRequest) {
  // Check access control first
  const accessResponse = await checkAccess(request)
  if (accessResponse) {
    return accessResponse
  }

  // Original middleware logic for backwards compatibility
  const response = NextResponse.next()
  const token = request.cookies.get("auth-token")?.value

  // Redirect authenticated users away from auth pages
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  if (isAuthRoute && token) {
    // Validate token format but don't redirect if it contains old invalid IDs
    if (token.startsWith('session_') || token.includes('.')) {
      // Check if token might contain old admin ID that causes database errors
      try {
        // Try to decode token to check for old IDs
        const payload = token.split('.')[1]
        if (payload) {
          const decoded = JSON.parse(atob(payload))
          // If token contains old admin-001 ID, clear it and don't redirect
          if (decoded.id === 'admin-001') {
            const clearResponse = NextResponse.next()
            clearResponse.cookies.delete('auth-token')
            return clearResponse
          }
        }
      } catch {
        // If token is malformed, clear it
        const clearResponse = NextResponse.next()
        clearResponse.cookies.delete('auth-token')
        return clearResponse
      }
      
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
