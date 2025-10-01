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
    // Simple token check - just verify it exists and has proper format
    if (token.startsWith('session_') || token.includes('.')) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
