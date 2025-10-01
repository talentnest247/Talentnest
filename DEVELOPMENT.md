# TalentNest Development Setup

## Quick Start (Without Supabase)

The application has been configured to work with mock data when Supabase is not available, so you can test all functionality locally.

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set up Environment (Optional)
Copy the environment template:
```bash
cp .env.template .env.local
```

For full functionality, you'll need to:
1. Create a Supabase project at https://app.supabase.com
2. Get your project URL and API keys
3. Run the database setup script in your Supabase SQL editor
4. Update .env.local with your actual values

### 3. Start Development Server
```bash
pnpm dev
```

## Default Login Credentials (Mock Data)
- **Admin**: admin@unilorin.edu.ng / admin123
- **Student**: student@unilorin.edu.ng / student123

## Features Implemented

### ✅ Authentication System
- Student and Artisan registration
- Secure login with JWT tokens
- Role-based access control
- Student ID verification

### ✅ Service Provider Dashboard
- Portfolio management
- Service listing
- Availability settings
- Learning opportunities toggle
- Professional verification status

### ✅ Student Dashboard
- Service discovery
- Provider search and filtering
- Review and rating system
- Booking management

### ✅ Admin Dashboard
- Provider verification
- User management
- Platform statistics
- Review moderation

### ✅ Core Features
- WhatsApp integration for direct contact
- Verification badges
- Professional portfolio showcase
- Peer-to-peer learning system
- University-specific branding

## PRD Compliance

All features follow the Product Requirements Document:
- ✅ Student artisan/provider registration and profiles
- ✅ Service discovery and search
- ✅ Verification system for trusted providers
- ✅ Review and rating system
- ✅ WhatsApp CTA for service booking
- ✅ Learning opportunities toggle
- ✅ Admin moderation and verification
- ✅ University of Ilorin branding

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL) with fallback to mock data
- **Authentication**: JWT with secure token handling
- **UI**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API

## File Structure

```
app/                    # Next.js app router pages
├── api/               # API routes for backend logic
├── auth/              # Authentication pages
├── dashboard/         # User dashboards
├── services/          # Service discovery and booking
└── admin/             # Admin panel

components/            # Reusable UI components
├── auth/              # Authentication forms
├── dashboard/         # Dashboard components
├── ui/                # Base UI components
└── layout/            # Layout components

lib/                   # Utility libraries
├── auth-utils.ts      # Authentication helpers
├── supabase.ts        # Database client
└── types.ts           # TypeScript definitions
```

## Testing

The application includes comprehensive error handling and fallback systems:
- Mock data when database is unavailable
- Graceful degradation of features
- Type-safe API interfaces
- Responsive design for all screen sizes

## Deployment

For production deployment:
1. Set up Supabase project
2. Configure environment variables
3. Run database migrations
4. Deploy to Vercel or similar platform

## Support

For issues or questions:
1. Check the error logs in the browser console
2. Verify environment variables are set correctly
3. Ensure Supabase project is configured if using real database