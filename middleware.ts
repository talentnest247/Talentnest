import { NextResponse, type NextRequest } from "next/server"

// Simple session verification for demo purposes
function verifySessionToken(token: string): boolean {
  if (!token || !token.startsWith('session_')) {
    return false
  }
  
  // Simple validation - in production you'd check against a database
  const parts = token.split('_')
  return parts.length === 3 && parts[0] === 'session'
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  // Protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/skills/enroll"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token || !verifySessionToken(token)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  if (isAuthRoute && token && verifySessionToken(token)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
