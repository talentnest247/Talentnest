import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  // If no code, redirect to Google OAuth
  if (!code) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/auth/google/callback`
    
    if (!googleClientId || googleClientId === 'your-google-client-id-here') {
      return NextResponse.redirect(`${baseUrl}/login?error=oauth_not_configured`)
    }

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', googleClientId)
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'email profile')
    googleAuthUrl.searchParams.set('state', 'login')

    return NextResponse.redirect(googleAuthUrl.toString())
  }

  // Handle the callback with code
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`)
    const googleUser = await userResponse.json()

    // Create or find user in your database
    const { supabaseAdmin } = await import("@/lib/supabase")
    
    if (!supabaseAdmin) {
      console.error("Supabase admin not available")
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=database_unavailable`)
    }

    // Check if user exists
    let { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', googleUser.email)
      .single()

    if (!user && !error?.code?.includes('PGRST116')) {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert([{
          email: googleUser.email,
          first_name: googleUser.given_name || '',
          last_name: googleUser.family_name || '',
          full_name: googleUser.name || `${googleUser.given_name} ${googleUser.family_name}`,
          role: 'student',
          password: 'google_oauth_user', // Placeholder for OAuth users
        }])
        .select()
        .single()

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`)
      }

      user = newUser
    }

    // Generate JWT token for the user
    const { authUtils } = await import("@/lib/auth-utils")
    const authUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      firstName: user.first_name,
      lastName: user.last_name,
      userType: user.role,
      role: user.role,
      studentId: user.student_id,
      department: user.department,
      level: user.level,
      phone: user.phone,
    }

    const token = await authUtils.generateToken(authUser)

    // Set auth cookie and redirect to dashboard
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_error`)
  }
}
