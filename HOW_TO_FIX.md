# 🔧 How to Fix Service Provider Registration

## ⚠️ Problem
Service provider registration is failing with errors:
- `column users.student_id does not exist`
- `User already exists: mediapowers13@gmail.com`

## ✅ Solution
Run SQL commands from **`DATABASE_FIX_ALL_IN_ONE.sql`**

---

## 📋 Quick Start (5 Minutes)

### **Step 1: Open Supabase**
1. Go to: https://app.supabase.com
2. Select your project
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New query"**

### **Step 2: Fix Database Schema**
Copy and run these commands from `DATABASE_FIX_ALL_IN_ONE.sql` (Section 1):

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
```

### **Step 3: Fix Existing User**
From `DATABASE_FIX_ALL_IN_ONE.sql` Section 3:

1. **Get user ID:**
```sql
SELECT id, email FROM auth.users WHERE email = 'mediapowers13@gmail.com';
```
Copy the `id` value (UUID)

2. **Add to public.users** (replace `PASTE_USER_ID_HERE` with the ID you copied):
```sql
INSERT INTO public.users (id, email, role, full_name, first_name, last_name, created_at)
VALUES (
    'PASTE_USER_ID_HERE'::uuid,
    'mediapowers13@gmail.com',
    'artisan',
    'Mohammed Nest',
    'Mohammed',
    'Nest',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET role = 'artisan';
```

3. **Create provider profile** (same ID):
```sql
INSERT INTO providers (
    user_id, business_name, description, specialization,
    experience, location, verification_status, verification_evidence,
    certificates, rating, total_reviews, verified,
    availability_is_available, availability_available_for_work,
    availability_available_for_learning, availability_response_time,
    pricing_currency, created_at, updated_at
)
VALUES (
    'PASTE_USER_ID_HERE'::uuid,
    'Mohammed Nest Services',
    'Professional service provider',
    ARRAY['General Services']::text[],
    0, '', 'pending', ARRAY[]::text[], ARRAY[]::text[],
    0.0, 0, false, true, true, false,
    'Usually responds within 24 hours', 'NGN', NOW(), NOW()
)
ON CONFLICT (user_id) DO NOTHING;
```

### **Step 4: Verify**
```sql
SELECT u.email, u.role, u.full_name,
       CASE WHEN p.id IS NOT NULL THEN '✅ Complete' ELSE '❌ Missing' END as status
FROM users u
LEFT JOIN providers p ON p.user_id = u.id
WHERE u.email = 'mediapowers13@gmail.com';
```

Should show: `✅ Complete`

### **Step 5: Test Login**
1. Go to: http://localhost:3000/login
2. Email: `mediapowers13@gmail.com`
3. Password: (your registration password)
4. Should work! ✅

---

## 🚀 Alternative: Delete & Re-register

If you prefer to start fresh:

```sql
-- Get user ID
SELECT id FROM auth.users WHERE email = 'mediapowers13@gmail.com';

-- Delete everything (replace PASTE_USER_ID_HERE)
DELETE FROM providers WHERE user_id = 'PASTE_USER_ID_HERE'::uuid;
DELETE FROM public.users WHERE id = 'PASTE_USER_ID_HERE'::uuid;
DELETE FROM auth.users WHERE id = 'PASTE_USER_ID_HERE'::uuid;
```

Then register again at: http://localhost:3000/register

---

## 📚 Complete Reference

All SQL commands are in: **`DATABASE_FIX_ALL_IN_ONE.sql`**

### Sections:
1. **Fix Database Schema** - Add missing columns
2. **Fix Admin User** - Set up admin account
3. **Fix Service Provider** - Complete registration
4. **Verification Queries** - Check status
5. **Delete User** - Remove and start fresh
6. **Find Issues** - Identify incomplete registrations
7. **Bulk Fix** - Auto-fix all incomplete registrations
8. **Health Check** - Database overview

---

## ✅ After Fix

✅ Database schema complete  
✅ User can login  
✅ New registrations work  
✅ Provider profiles auto-created  
✅ Admin dashboard shows providers  

---

## 🎯 Admin Login

After fixing everything, test admin panel:

- **URL**: http://localhost:3000/admin/login
- **Email**: talentnest247@gmail.com
- **Password**: talentnest247
- **Access Code**: UNILORIN-ADMIN-2025

---

**Need help? Check `DATABASE_FIX_ALL_IN_ONE.sql` for complete instructions and all SQL commands.**
