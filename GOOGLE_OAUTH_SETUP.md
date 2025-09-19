# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for the University of Ilorin Artisan Community Platform.

## Prerequisites

- Node.js and pnpm installed
- A Google Cloud Console account
- Basic understanding of OAuth 2.0 flow

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `Unilorin Artisan Platform` (or your preferred name)
4. Click "Create"
5. Make sure your new project is selected

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" 
3. Click on "Google+ API" and click "Enable"
4. Alternatively, search for "Google Identity" and enable "Google Identity Toolkit API"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace organization)
3. Fill in the required information:
   - **App name**: `University of Ilorin Artisan Platform`
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **App domain**: `http://localhost:3000` (for development)
   - **Authorized domains**: Add `localhost` for development
4. Add scopes (click "Add or Remove Scopes"):
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile` 
   - `openid`
5. Add test users (your email addresses) if the app is in testing mode
6. Click "Save and Continue" through all steps

## Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Configure the following:
   - **Name**: `Unilorin Artisan Platform Web Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production - add when deployed)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)
5. Click "Create"
6. **Important**: Copy the Client ID and Client Secret - you'll need these!

## Step 5: Configure Environment Variables

1. Open your `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-client-id-from-step-4
GOOGLE_CLIENT_SECRET=your-actual-client-secret-from-step-4

# Application Settings (update for production)
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Example `.env.local` (with dummy values):
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration  
JWT_SECRET=your-generated-jwt-secret-here
NEXTAUTH_SECRET=your-generated-nextauth-secret-here

# Application Settings
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdef123456_your_secret_here
```

## Step 6: Test the OAuth Flow

1. Start your development server:
```bash
pnpm dev
```

2. Navigate to `http://localhost:3000/login`
3. Click the "Continue with Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you should be redirected back to your application

## OAuth Flow Architecture

Our custom OAuth implementation works as follows:

1. **Initiation**: `/api/auth/signin/google` - Redirects to Google OAuth
2. **Callback**: `/api/auth/google/callback` - Handles the OAuth response
3. **Authentication**: Creates/updates user in database and sets JWT tokens

### Key API Routes:
- `GET /api/auth/signin/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback
- `GET /api/auth/oauth-status` - Checks OAuth configuration status
- `POST /api/auth/login` - Traditional email/password login
- `POST /api/auth/logout` - Logout and clear tokens

## Troubleshooting

### Error: "oauth_not_configured"
- Check that `GOOGLE_CLIENT_ID` is set and not the default placeholder value
- Verify your `.env.local` file is in the project root
- Restart your development server after changing environment variables

### Error: "redirect_uri_mismatch"
- Ensure your redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/google/callback`
- Check that there are no trailing slashes or extra characters
- Verify the domain is added to "Authorized JavaScript origins"

### Error: "This app isn't verified"
- This is normal during development with external user types
- Click "Advanced" → "Go to [App Name] (unsafe)" to continue testing
- For production, submit your app for Google's verification process

### Error: "access_denied"
- User cancelled the OAuth flow
- Check OAuth consent screen configuration
- Ensure required scopes are properly configured

## Production Deployment

When deploying to production:

1. **Update OAuth Settings**:
   - Add your production domain to authorized origins and redirect URIs
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URLs

2. **Secure Environment Variables**:
   - Never commit `.env.local` to version control
   - Use your hosting provider's environment variable system
   - Generate new JWT secrets for production

3. **App Verification** (Optional but Recommended):
   - Submit your app for Google's verification process
   - This removes the "unverified app" warning for users
   - Required if you plan to request sensitive scopes

## Security Best Practices

1. **Environment Variables**: Never expose client secrets in client-side code
2. **HTTPS**: Always use HTTPS in production
3. **JWT Secrets**: Use cryptographically strong secrets (generated via `pnpm run generate-jwt-secret`)
4. **Scope Limitation**: Only request necessary OAuth scopes
5. **Regular Updates**: Keep dependencies updated for security patches

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

---

## Quick Setup Commands

Generate JWT secrets:
```bash
pnpm run generate-jwt-secret
```

Test OAuth status:
```bash
curl http://localhost:3000/api/auth/oauth-status
```

Check environment setup:
```bash
pnpm run setup-env
```

---

**Need Help?** If you encounter issues, check the terminal logs when testing OAuth flow, and ensure all environment variables are properly set.
