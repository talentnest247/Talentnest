# TalentNest Admin Setup Guide

## 🔧 How to Become Admin & Access Admin Panel

### Step 1: Create Your Account
1. **Register normally** as a student using: `talentsnest247@gmail.com`
2. Go to `/register` and fill the student registration form
3. Complete email verification if required

### Step 2: Make Yourself Admin
After registering, run this SQL command in your **Supabase SQL Editor**:

```sql
SELECT public.make_admin('talentsnest247@gmail.com');
```

This will:
- Set your role to 'admin'
- Mark your account as verified
- Activate your account

### Step 3: Access Admin Panel
1. **Login** with your credentials at `/login`
2. **Navigate to**: `/admin` or `/admin/verification`
3. You'll see the admin dashboard with:
   - User management
   - Artisan verification panel
   - Document review system

## 🎯 Admin Panel Features

### Artisan Verification (`/admin/verification`)
- **View all artisan applications**
- **Download uploaded documents** (certificate, bio, supporting docs)
- **Approve/Reject applications** with notes
- **Track verification status**

### User Management (`/admin/users`)
- **View all registered users**
- **See user roles** (student/artisan/admin)
- **Manage user status** (active/inactive)

## 🔍 What You Can Check

### User Records:
- **Total users** registered
- **Student vs Artisan** breakdown
- **Verification status** of artisans
- **Contact information** and profiles

### Document Management:
- **Download certificates** for verification
- **Review bio documents** and portfolios
- **Check supporting documents** (ID, work samples)
- **Add verification notes**

### Approval Workflow:
1. **Review application** and documents
2. **Download files** to verify authenticity
3. **Approve** ✅ or **Reject** ❌ with comments
4. **Track approved artisans** offering services

## 🚀 Quick Start Checklist

- [ ] Register with `talentsnest247@gmail.com`
- [ ] Run admin SQL command in Supabase
- [ ] Login and visit `/admin`
- [ ] Test artisan registration flow
- [ ] Verify document upload works
- [ ] Practice approval/rejection process

## 📧 Your Admin Credentials
- **Email**: `talentsnest247@gmail.com`
- **Access**: Full admin privileges
- **Panel**: `/admin` route after login

You're all set to manage the TalentNest platform! 🎉
