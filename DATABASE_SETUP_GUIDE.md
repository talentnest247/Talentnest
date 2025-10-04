# 🚀 TalentNest Database Setup Guide

## ⚠️ CRITICAL: You MUST run this SQL script in Supabase first!

Your database is missing the `users` table. Follow these steps:

## Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **TalentNest** project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Run the Database Schema

1. Copy the ENTIRE content of `database-setup-prd.sql`
2. Paste it into the SQL Editor
3. Click **RUN** (or press Ctrl+Enter)
4. Wait for completion (should take 5-10 seconds)

## Step 3: Verify Tables Were Created

Run this query to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- ✅ users
- ✅ students
- ✅ providers
- ✅ categories
- ✅ portfolio
- ✅ bookings
- ✅ reviews
- ✅ verification_requests
- ✅ contact_requests

## Step 4: Create Your First Admin User

After the schema is created, you need an admin account:

```sql
-- First, sign up through Supabase Auth (or your app)
-- Then run this to make that user an admin:

UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

## Step 5: Restart Your Development Server

```bash
pnpm dev
```

## 🎯 What This Fixes

✅ "Could not find the table 'public.users'" error
✅ Admin dashboard will load properly
✅ User authentication will work
✅ Artisan verification workflow will function
✅ Services marketplace will display
✅ All database operations will succeed

## 🔧 Troubleshooting

### If tables already exist:
The script has `DROP TABLE IF EXISTS` commands, so it's safe to re-run.

### If you get permission errors:
Make sure you're using the Supabase SQL Editor (has admin permissions).

### If data gets deleted:
The script drops existing tables! Backup important data first.

## 📝 Next Steps After Database Setup

1. Create categories (done automatically by script)
2. Register test users through the app
3. Some users should register as artisans/providers
4. Admin can then verify artisans in the dashboard
5. Verified artisans appear in the services marketplace

---

**⚠️ DO NOT SKIP THIS STEP!** 

Your application cannot function without the database schema being applied first.
