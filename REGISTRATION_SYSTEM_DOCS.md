# TalentNest Registration System with Artisan Verification

This document outlines the enhanced registration system that supports both students and artisans with an admin verification process for artisans.

## Overview

The registration system has been completely revamped to support:
- **Student Registration**: Open registration with any email address
- **Artisan Registration**: Registration with admin verification required
- **Admin Verification Panel**: Complete artisan verification system

## Database Schema Changes

### New Tables Created

1. **artisan_profiles**
   - Stores artisan business information
   - Verification status tracking
   - Business details and trade categories

2. **artisan_documents**
   - Stores uploaded verification documents
   - File metadata and type classification

### Enhanced Users Table
- Added role-based system (student, artisan, admin)
- Flexible email system (not restricted to university emails)
- Academic information now optional for students

## Key Features

### 1. Student Registration (`/register/student`)
- **Email**: Any valid email address (not restricted to university emails)
- **Academic Info**: Optional fields for university-related information
- **Immediate Access**: Students can access the platform immediately after email verification

### 2. Artisan Registration (`/register/artisan`)
- **Business Information**: Complete business profile setup
- **Document Upload**: Multiple file upload for verification documents
- **Verification Required**: Account remains inactive until admin approval
- **Trade Categories**: 20+ predefined trade categories

### 3. Admin Verification Panel (`/admin/verification`)
- **Document Review**: View and download uploaded documents
- **Approval/Rejection**: Complete verification workflow
- **Status Tracking**: Track all artisan applications by status
- **Notes System**: Add verification notes for decisions

## File Structure

```
├── app/
│   ├── register/
│   │   ├── page.tsx                 # Main registration page
│   │   ├── student/
│   │   │   └── page.tsx            # Student registration
│   │   └── artisan/
│   │       └── page.tsx            # Artisan registration
│   ├── admin/
│   │   └── verification/
│   │       └── page.tsx            # Admin verification panel
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts            # File upload API
│   │   └── admin/
│   │       └── artisans/
│   │           └── route.ts        # Admin operations API
│   └── auth/
│       └── sign-up-success/
│           └── page.tsx            # Enhanced success page
├── components/
│   ├── auth/
│   │   ├── student-register-form.tsx
│   │   └── artisan-register-form.tsx
│   ├── admin/
│   │   └── artisan-verification.tsx
│   └── upload/
│       └── file-upload.tsx
├── lib/
│   └── types.ts                    # Enhanced type definitions
└── scripts/
    ├── 05-enhanced-schema-artisan-verification.sql
    └── 06-enhanced-rls-policies.sql
```

## Database Setup

### 1. Run Schema Migration
Execute the SQL script in your Supabase dashboard:
```sql
-- Run scripts/05-enhanced-schema-artisan-verification.sql
```

### 2. Setup RLS Policies
Execute the RLS policies script:
```sql
-- Run scripts/06-enhanced-rls-policies.sql
```

### 3. Storage Bucket
The `artisan-documents` storage bucket is automatically created by the schema script.

## Trade Categories

The system includes 20 predefined trade categories:
- Carpentry
- Plumbing
- Electrical Work
- Masonry & Construction
- Painting & Decoration
- Welding & Metal Work
- Tailoring & Fashion
- Hair Styling & Beauty
- Auto Repair & Mechanics
- Electronics Repair
- Phone & Computer Repair
- Catering & Food Services
- Photography & Videography
- Graphic Design
- Web Development
- Tutoring & Education
- Cleaning Services
- Event Planning
- Agriculture & Farming
- Other

## User Roles and Permissions

### Student
- Can register with any email
- Immediate access after email verification
- Can view approved artisan profiles
- Can book services from verified artisans

### Artisan
- Must provide business information
- Must upload verification documents
- Account inactive until admin approval
- Can offer services only after verification

### Admin
- Can view all artisan applications
- Can approve/reject applications
- Can download verification documents
- Can add notes to verification decisions

## Verification Process

1. **Artisan Registers**: Submits application with documents
2. **Admin Review**: Admin reviews business info and documents
3. **Decision**: Admin approves or rejects with optional notes
4. **Notification**: Artisan receives email notification
5. **Activation**: Approved artisans can start offering services

## Security Features

- **Row Level Security (RLS)**: Comprehensive policies for all tables
- **File Security**: User-scoped file access
- **Role-based Access**: Proper permission checks
- **Document Verification**: Admin-only access to verification documents

## API Endpoints

### File Upload
- **POST** `/api/upload` - Upload verification documents
- **DELETE** `/api/upload?fileName=...` - Delete uploaded files

### Admin Operations
- **GET** `/api/admin/artisans` - Get all artisan applications
- **PATCH** `/api/admin/artisans` - Update verification status

## File Upload Specifications

- **Max File Size**: 10MB per file
- **Max Files**: 10 files per artisan
- **Supported Types**: 
  - Images (JPEG, PNG, GIF, WebP)
  - Documents (PDF, DOC, DOCX)
- **Storage**: Supabase Storage with proper RLS policies

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Dependencies Added

```json
{
  "react-dropzone": "^14.x.x",
  "sonner": "^1.x.x"
}
```

## Usage Examples

### Creating an Admin User
```sql
-- In Supabase SQL Editor
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Checking Verification Status
```sql
-- View all pending artisans
SELECT 
  ap.*,
  u.full_name,
  u.email
FROM artisan_profiles ap
JOIN users u ON u.id = ap.user_id
WHERE ap.verification_status = 'pending';
```

## Testing the System

1. **Test Student Registration**
   - Navigate to `/register/student`
   - Use any email address
   - Complete registration

2. **Test Artisan Registration**
   - Navigate to `/register/artisan`
   - Fill business information
   - Upload sample documents
   - Submit for verification

3. **Test Admin Verification**
   - Set user role to 'admin' in database
   - Navigate to `/admin/verification`
   - Review and approve/reject applications

## Future Enhancements

- Email notifications for verification status changes
- Document type detection and categorization
- Bulk operations for admin panel
- Enhanced search and filtering in admin panel
- Integration with external verification services

## Support

For any issues or questions regarding the registration system, please refer to the component documentation or check the database schema files for detailed table structures.
