# Admin User Creation - ID and Password Guide

## **Your Questions Answered:**

### **1. Admin Account ID**
❌ **Current Issue**: Script creates NEW admin users with random UUIDs  
✅ **Solution**: We need to either:
- **Option A**: Convert your existing user to admin
- **Option B**: Create new admin but use specific ID you want

### **2. Password for support@celorisdesigns.com**
❌ **Current Issue**: SQL uses dummy password that won't work for login  
✅ **Solution**: Must create admin through proper Supabase Auth method

## **Recommended Approach: Option A (Convert Existing User)**

### **Step 1: Check Your Current Users**
```sql
SELECT id, username, full_name, email FROM public.users ORDER BY created_at;
```

### **Step 2: Convert User to Admin**
```sql
-- Run ADMIN_FOR_EXISTING_USER.sql
-- Change target_username to your actual username
```

### **Step 3: Set Proper Password**
**The SQL password is a dummy hash. For real login, you must:**

1. **Go to Supabase Dashboard → Authentication → Users**
2. **Find support@celorisdesigns.com user**
3. **Reset password manually**
4. **Or invite new admin user through Supabase Auth**

## **Alternative: Option B (Create New Admin with Real Auth)**

### **Method 1: Supabase Auth Dashboard**
1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **"Invite User"**
3. Enter `support@celorisdesigns.com`
4. Set password and role
5. Then run script to add admin role to that user ID

### **Method 2: Your App Signup**
1. Go to your app's signup page
2. Create account with `support@celorisdesigns.com`
3. Set password yourself
4. Then convert to admin

## **Current User Data:**
From your screenshot, I see:
- User: `ananyajairath` (Ananya Jairath)
- Might want to make this the admin account

## **Recommendation:**
**Use Option A** - convert your existing user to admin, then set password through Supabase Auth dashboard. This preserves your existing account and makes admin setup much simpler.

Would you like me to:
1. Convert existing user to admin?
2. Or help you set up new admin with proper authentication?