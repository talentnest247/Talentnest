import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const nextAuthUrl = process.env.NEXTAUTH_URL

    const checks = {
      googleClientId: !!googleClientId && googleClientId !== 'your-google-client-id-here',
      googleClientSecret: !!googleClientSecret && googleClientSecret !== 'your-google-client-secret-here',
      nextAuthUrl: !!nextAuthUrl,
      hasCredentials: false
    }

    checks.hasCredentials = checks.googleClientId && checks.googleClientSecret && checks.nextAuthUrl

    return NextResponse.json({
      message: "Google OAuth Configuration Status",
      status: checks.hasCredentials ? "✅ Ready" : "⚠️  Needs Setup",
      checks,
      nextSteps: checks.hasCredentials 
        ? ["Google OAuth is configured and ready to use!"]
        : [
          "1. Set up Google OAuth in Google Cloud Console",
          "2. Update GOOGLE_CLIENT_ID in .env.local", 
          "3. Update GOOGLE_CLIENT_SECRET in .env.local",
          "4. See GOOGLE_OAUTH_SETUP.md for detailed instructions"
        ]
    })
  } catch (error) {
    return NextResponse.json({
      error: "Failed to check OAuth configuration",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
