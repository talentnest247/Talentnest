<!-- # Certificate and Bio Upload System for Artisan Registration

This document describes the new certificate and bio upload system that has been implemented for artisan registration with admin verification.

## Overview

The system allows artisans to:
1. Upload their professional bio during registration
2. Upload up to 3 certificates or proof of expertise documents
3. Submit their application for admin verification
4. Get verified by admin before being able to offer services to students

## New Features Added

### 1. Database Schema Updates

#### Providers Table
- `bio` (TEXT): Professional bio/background of the artisan
- `certificates` (TEXT[]): Array of URLs pointing to uploaded certificate files

#### File Upload Storage
- New Supabase storage bucket: `certificates`
- Supports PDF, JPG, PNG, WEBP files up to 5MB each

### 2. Registration Form Enhancements

#### Bio Field
- Required textarea with 500 character limit
- Helps artisans describe their background and expertise
- Validates that bio is provided for artisan registrations

#### Certificate Upload
- File upload component supporting multiple files
- Maximum 3 files per registration
- Accepted formats: PDF, JPG, PNG, WEBP
- File size limit: 5MB per file
- Real-time upload with progress indicator

### 3. Admin Verification Dashboard

#### Enhanced Verification View
- Displays uploaded bio in a dedicated section
- Shows all uploaded certificates with preview
- Certificate download functionality
- Separate section for additional evidence files

#### Verification API
- `GET /api/admin/verification` - Fetch pending verification requests
- `POST /api/admin/verification` - Approve or reject applications
- Real-time status updates

### 4. File Upload System

#### Upload API
- `POST /api/upload` - Upload files to Supabase storage
- `DELETE /api/upload` - Remove uploaded files
- File type and size validation
- Unique filename generation

#### File Upload Component
- Reusable React component
- Drag and drop support
- Progress indicators
- Error handling
- File preview and management

## Usage

### For Artisans

1. **Registration Process**:
   - Select "Artisan" role during registration
   - Fill in business information and specialization
   - Write a professional bio (required)
   - Upload certificates/proof of expertise (required, minimum 1 file)
   - Submit registration

2. **Verification Status**:
   - All artisan registrations start with "pending" verification status
   - Artisans must wait for admin approval before offering services
   - Verified artisans get a "verified" badge on their profiles

### For Admins

1. **Review Applications**:
   - Access admin verification dashboard
   - Review artisan bio and uploaded certificates
   - Download and examine proof documents
   - Check student verification details

2. **Make Decisions**:
   - Approve applications with sufficient proof
   - Reject applications with detailed reason
   - Add admin notes for record keeping

### For Students

1. **Find Verified Artisans**:
   - Only verified artisans appear in search results
   - Verified badge indicates admin-approved credentials
   - Bio and certificates visible on artisan profiles

## Technical Implementation

### File Storage Structure
```
certificates/
├── provider-certificates/
│   ├── user123_timestamp.pdf
│   ├── user456_timestamp.jpg
│   └── ...
└── portfolios/
    ├── user789_timestamp.png
    └── ...
```

### Database Schema Changes
```sql
-- Add new columns to providers table
ALTER TABLE providers 
ADD COLUMN bio TEXT,
ADD COLUMN certificates TEXT[] DEFAULT ARRAY[]::TEXT[];
```

### API Endpoints

#### Upload Files
```typescript
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File to upload
- folder: "certificates"
- userId: User identifier
```

#### Verification Management
```typescript
GET /api/admin/verification
Response: Array of VerificationRequest objects

POST /api/admin/verification
Body:
{
  action: "approve" | "reject",
  providerId: string,
  adminNotes?: string
}
```

### Security Considerations

1. **File Upload Security**:
   - File type validation on client and server
   - File size limits enforced
   - Unique filename generation to prevent conflicts
   - Virus scanning recommended for production

2. **Access Control**:
   - Only authenticated users can upload files
   - Public read access for admin verification
   - Users can only delete their own files

3. **Data Privacy**:
   - Certificates contain personal information
   - Admin access logs should be maintained
   - Secure file deletion when accounts are removed

## Setup Instructions

### 1. Database Migration
Run the migration script to add new columns:
```bash
# Run in Supabase SQL Editor
cat scripts/add-bio-certificates-migration.sql
```

### 2. Storage Setup
Configure Supabase storage bucket:
```bash
# Run in Supabase SQL Editor
cat scripts/setup-storage-bucket.sql
```

### 3. Environment Variables
Ensure these environment variables are set:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Deployment
Deploy the updated application with the new features.

## File Structure

### New Files Added
- `components/ui/file-upload.tsx` - Reusable file upload component
- `app/api/upload/route.ts` - File upload API endpoint
- `app/api/admin/verification/route.ts` - Verification management API
- `scripts/add-bio-certificates-migration.sql` - Database migration
- `scripts/setup-storage-bucket.sql` - Storage bucket setup

### Modified Files
- `components/auth/register-form.tsx` - Added bio and certificate fields
- `components/admin/verification-dashboard.tsx` - Enhanced verification UI
- `lib/types.ts` - Updated types for bio and certificates
- `lib/database.types.ts` - Updated database schema types
- `lib/auth-utils.ts` - Added createProvider function
- `app/api/auth/register/route.ts` - Enhanced registration logic

## Future Enhancements

1. **Email Notifications**:
   - Send verification status updates to artisans
   - Notify admins of new applications

2. **Advanced File Management**:
   - Image resizing and optimization
   - PDF thumbnail generation
   - Bulk certificate upload

3. **Verification Analytics**:
   - Track verification times
   - Generate approval/rejection reports
   - Monitor upload patterns

4. **Enhanced Security**:
   - Implement virus scanning
   - Add watermarking for certificates
   - Digital signature verification

## Support

For technical issues or questions about the certificate upload system:
1. Check the console logs for error details
2. Verify file format and size requirements
3. Ensure proper Supabase configuration
4. Contact the development team for assistance -->
