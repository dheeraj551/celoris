# Quick Fix Guide for Username Constraint Error

## **Problem Summary**
- Error: `null value in column "username" of relation "users" violates not-null constraint`
- Your system uses `public.users` table (not `public.profiles`)
- The `username` column requires a value

## **Solution**
Use the corrected fix file instead:

### **Step 1: Run the Corrected Fix**
Copy and paste `CORRECTED_USER_ADMIN_FIX.sql` into Supabase SQL Editor

### **Step 2: What This Fixes**
- ✅ Creates admin users with proper usernames
- ✅ Fixes `handle_new_user()` trigger function
- ✅ Updates RLS policies to use correct table
- ✅ Resolves NOT NULL constraint error

### **Step 3: Verify Success**
After running, check that:
- Admin users appear in `public.users` table
- Both admin accounts have `role = 'admin'`
- New user registration works without errors

## **Key Differences from Previous Version**
1. **Table**: Uses `public.users` instead of `public.profiles`
2. **Username**: Provides explicit username values
3. **Columns**: Matches your actual table structure
4. **RLS**: Checks `users.role` instead of `profiles.role`

This should completely resolve the constraint violation error!