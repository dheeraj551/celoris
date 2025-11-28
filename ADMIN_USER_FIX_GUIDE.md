# Admin User & Registration Fix Guide

## **Problem Summary**
You identified two critical issues:
1. **Admin user not visible** - Admin accounts exist in RLS policies but not in actual database tables
2. **New user registration fails** - Database errors when creating new users
3. **Missing admin field** - System should use `is_admin` or proper role system

## **Root Cause**
- We created RLS policies that check for admin email addresses
- But we never actually created the admin users in `auth.users` table
- New user registration fails because there's no automatic profile creation
- System uses `role` column, not `is_admin` boolean

## **Solution Files Created**

### **1. DIAGNOSTIC FILE**
**File**: `USER_ADMIN_DIAGNOSTIC.sql`
- Run this first to see current status
- Shows all users, profiles, admin accounts, and missing profiles
- Displays current RLS policies

### **2. COMPREHENSIVE FIX**
**File**: `COMPREHENSIVE_USER_ADMIN_FIX.sql`
- **Part 1**: Creates admin users for both email addresses
- **Part 2**: Fixes new user registration with automatic profile creation
- **Part 3**: Updates RLS policies to use role-based access
- **Part 4**: Verification checks

## **How to Use**

### **Step 1: Run Diagnostic**
```sql
-- Copy and paste USER_ADMIN_DIAGNOSTIC.sql into Supabase SQL Editor
-- This will show you the current state
```

### **Step 2: Apply Comprehensive Fix**
```sql
-- Copy and paste COMPREHENSIVE_USER_ADMIN_FIX.sql into Supabase SQL Editor
-- This will create admin users and fix registration
```

## **What the Fix Does**

### **Admin User Creation**
- Creates `support@celorisdesigns.com` as admin user
- Creates `celoris.designs@gmail.com` as admin user
- Adds corresponding profiles with `role = 'admin'`
- Both accounts get `is_active = TRUE`

### **New User Registration**
- Creates automatic trigger: `handle_new_user()`
- Runs when new user signs up in `auth.users`
- Automatically creates profile in `public.profiles`
- Sets default role as `'user'`
- Prevents registration failures

### **RLS Policy Update**
- Old: Check email addresses in policies
- New: Check `profile.role = 'admin'`
- More secure and maintainable
- Properly checks user exists and is active

## **Expected Results After Fix**

### **Admin Users Visible**
- Both admin emails now show in `public.profiles` table
- Both have `role = 'admin'`
- Both are `is_active = TRUE`

### **New User Registration Works**
- New signups automatically get profiles
- No more database errors during registration
- Default role set to `'user'`

### **Admin Functions Work**
- Course creation should work for admin users
- Instagram upload should work for admin users
- Profile management should work

## **Verification Steps**

After running the fix, check:
1. **Diagnostic file shows admin users**
2. **New user signup works**
3. **Course creation succeeds**
4. **Instagram upload works**

## **Files Created**
- `USER_ADMIN_DIAGNOSTIC.sql` - Check current status
- `COMPREHENSIVE_USER_ADMIN_FIX.sql` - Complete solution
- `CREATE_ADMIN_USER.sql` - Admin creation only
- `UPDATE_ADMIN_RLS_POLICIES.sql` - Policy updates only

## **Security Notes**
- Admin passwords in SQL are dummy hashes
- In production, create admin users through Supabase Auth API
- Use real authentication for admin accounts
- The trigger function uses `SECURITY DEFINER` for proper permissions