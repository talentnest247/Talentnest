import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'

    // Create the OAuth sign-in URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(new URL('/login?error=oauth_error', request.url))
    }

    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    // Fallback redirect
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url))

  } catch (error) {
    console.error('Google signin error:', error)
    return NextResponse.redirect(new URL('/login?error=server_error', request.url))
  }
}

export async function POST() {
  return NextResponse.json(
    { message: 'Method not allowed. Use GET to initiate Google OAuth.' },
    { status: 405 }
  )
}
