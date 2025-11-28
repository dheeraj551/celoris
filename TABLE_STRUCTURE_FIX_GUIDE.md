# Admin Creation Fix - Table Structure Issue

## **Problem**
Error: "column 'email' does not exist" - Your `public.users` table has different structure than assumed.

## **Solution**
Use two-step approach:

### **Step 1: Check Structure**
Run `CHECK_TABLE_STRUCTURE.sql` to see your actual table columns.

### **Step 2: Create Admin Users** 
Run `CORRECTED_STRUCTURE_ADMIN.sql` which uses only existing columns.

## **What the Corrected Version Fixes**
- ✅ Uses only `username`, `role`, `status`, `is_active` columns (no `email`, `full_name`)
- ✅ Provides explicit usernames to satisfy NOT NULL constraint
- ✅ Creates admin users in both `auth.users` and `public.users`
- ✅ Fixes trigger function for new user registration
- ✅ Updates RLS policies to check the correct table/columns

## **Expected Results**
After both steps:
- ✅ 2 admin users in `public.users` with `role = 'admin'`
- ✅ 2 admin accounts in `auth.users`
- ✅ Working trigger for new user registration
- ✅ Fixed RLS policies for admin access

Run both files in sequence - this should resolve all admin user creation issues!