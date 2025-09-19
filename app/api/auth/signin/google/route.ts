import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/auth/google/callback`
    
    if (!googleClientId || googleClientId === 'your-google-client-id-here') {
      return NextResponse.redirect(`${baseUrl}/login?error=oauth_not_configured`)
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', googleClientId)
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'email profile')
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'select_account')

    return NextResponse.redirect(googleAuthUrl.toString())
  } catch (error) {
      console.error('Google OAuth initiation error:', error)
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      return NextResponse.redirect(`${baseUrl}/login?error=oauth_init_failed`)
    }
}
