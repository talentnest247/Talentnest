# Quick Fix Guide - Provider Approval System

## Error Resolved ✅
The duplicate key error has been fixed. The updated SQL now handles existing users properly.

## Step-by-Step Instructions

### Step 1: Check Current Database Status (SAFE - No Changes)
**File:** `CHECK_DATABASE_STATUS.sql`

1. Open Supabase Dashboard
2. Click "SQL Editor"
3. Copy **ALL** of `CHECK_DATABASE_STATUS.sql`
4. Paste and click "Run"
5. Look at the results:

**What to look for:**
```
PROVIDER COUNTS BY STATUS
pending | X
approved | X
TOTAL | X
```

- **If TOTAL = 0:** No providers exist → Go to Step 2
- **If TOTAL > 0:** Providers exist → Skip to Step 3

---

### Step 2: Create Test Provider (Only if Step 1 showed 0 providers)
**File:** `CREATE_TEST_PROVIDER.sql`

1. Copy **ALL** of `CREATE_TEST_PROVIDER.sql`
2. Paste in Supabase SQL Editor
3. Click "Run"
4. Check the output:
   ```
   ✅ SUCCESS! Test provider created
   Provider ID: [uuid]
   Status: pending
   ```

**Test credentials created:**
- Email: test.artisan@talentnest.com
- Password: TestPassword123!
- Status: pending (needs approval)

---

### Step 3: Test Admin Dashboard

1. **Make sure dev server is running:**
   ```bash
   pnpm dev
   ```

2. **Open admin dashboard:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Login with:**
   - Email: `talentnest247@gmail.com`
   - Password: `talentnest247`
   - Access Code: `UNILORIN-ADMIN-2025`

4. **Check the dashboard:**
   - **Stats card** should show "Total Providers: 1" (or more)
   - **Stats card** should show "Pending: 1" (or more)

5. **Click "Pending" tab:**
   - Should see "Test Artisan Services" (or your registered provider)
   - Business name, location, experience visible

6. **Test approval:**
   - Click "Approve" button
   - Optional: Add feedback message
   - Click "Approve" in dialog
   - Provider should move to "Approved" tab
   - Success message appears

7. **Verify in marketplace:**
   - Go to: `http://localhost:3000/marketplace`
   - Should see approved provider listed
   - Click to view details

---

## If Admin Dashboard Still Shows No Providers

### Check 1: Service Role Key
File: `.env.local` (in project root)

```env
# This must be service_role key, NOT anon key!
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Get it from: Supabase Dashboard → Project Settings → API → service_role
```

**After adding/changing:**
```bash
# Restart dev server
Ctrl+C
pnpm dev
```

### Check 2: Browser Console
1. Open admin dashboard
2. Press F12 (DevTools)
3. Go to "Console" tab
4. Look for errors (red text)
5. Go to "Network" tab
6. Find: `/api/providers?include_all_statuses=true`
7. Click it
8. Check "Response" tab
9. Should see: `{"providers": [...]}`

### Check 3: Terminal Logs
Look for these messages:
```
✅ Good:
Getting providers with filters: { include_all_statuses: true }
Found X providers

❌ Bad:
No providers found
RLS policy error
Service role key not configured
```

---

## Alternative: Register New Provider Manually

If you prefer to test with real registration:

1. **Logout:** Go to `http://localhost:3000/api/auth/logout`

2. **Register:** Go to `http://localhost:3000/register`

3. **Fill form:**
   - Select: "Artisan"
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Password: Test1234!
   - Phone: +2341234567890
   - Business Name: John's Services
   - Specialization: Fashion Design
   - Experience: 5
   - Location: University of Ilorin
   - **SKIP file uploads** (can cause timeout)

4. **Submit and watch terminal:**
   ```
   ✅ Good:
   User created successfully: [uuid]
   Provider profile created successfully: [data]

   ❌ Bad:
   Failed to create provider profile: [error]
   ```

5. **Login as admin and approve**

---

## Files Overview

| File | Purpose | Safe? |
|------|---------|-------|
| `CHECK_DATABASE_STATUS.sql` | Check database state | ✅ Safe - No changes |
| `CREATE_TEST_PROVIDER.sql` | Create test provider | ⚠️ Creates data |
| `FIX_PROVIDER_APPROVAL_SYSTEM.sql` | Full diagnostic + fixes | ⚠️ Creates data + fixes policies |
| `test-provider-api.js` | Test APIs in browser | ✅ Safe - Read only |

---

## Quick Troubleshooting

### Issue: "No providers found"
**Solution:** Run `CREATE_TEST_PROVIDER.sql` or register manually

### Issue: "RLS policy error"
**Solution:** Run `FIX_PROVIDER_APPROVAL_SYSTEM.sql` (Step 3)

### Issue: "Service role key not configured"
**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and restart

### Issue: "Provider registration fails"
**Cause:** File upload timeout
**Solution:** Skip file uploads when registering

### Issue: "Admin dashboard loads but shows 0 providers"
**Check:**
1. Run `CHECK_DATABASE_STATUS.sql` - are providers there?
2. Check browser console for errors
3. Check terminal for "No providers found with filters"
4. Verify service role key in `.env.local`

---

## Success Indicators ✅

You know it's working when:
- ✅ `CHECK_DATABASE_STATUS.sql` shows providers
- ✅ Admin stats show "Total Providers: X" where X > 0
- ✅ "Pending" tab shows providers
- ✅ Can click "Approve" button
- ✅ Provider moves to "Approved" tab
- ✅ Approved provider visible in marketplace
- ✅ No errors in browser console
- ✅ No errors in terminal

---

## Need Help?

1. Run `CHECK_DATABASE_STATUS.sql` and share results
2. Share terminal output when registering
3. Share browser console errors (F12)
4. Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
