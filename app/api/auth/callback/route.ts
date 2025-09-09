import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'

    // Handle OAuth errors
    if (error) {
      console.error('OAuth callback error:', error)
      return NextResponse.redirect(new URL(`/login?error=oauth_${error}`, request.url))
    }

    if (!code) {
      console.error('No authorization code provided')
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    const supabase = await createClient()

    // Exchange the code for a session
    const { data: { user, session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(new URL('/login?error=exchange_failed', request.url))
    }

    if (!user || !session) {
      console.error('No user or session after code exchange')
      return NextResponse.redirect(new URL('/login?error=no_session', request.url))
    }

    // Check if this is a new user (first time signing in with Google)
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email, role, full_name')
      .eq('id', user.id)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('Database query error:', userError)
      // Continue anyway, we'll handle this in the client
    }

    // If user doesn't exist in our users table, redirect to role selection
    if (!existingUser) {
      console.log('New Google user, redirecting to role selection')
      return NextResponse.redirect(new URL('/auth/complete-registration', request.url))
    }

    // User exists, redirect to their intended destination
    console.log('Existing user logged in:', existingUser.email)
    return NextResponse.redirect(new URL(redirectTo, request.url))

  } catch (error) {
    console.error('OAuth callback unexpected error:', error)
    return NextResponse.redirect(new URL('/login?error=unexpected_error', request.url))
  }
}

export async function POST() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}
