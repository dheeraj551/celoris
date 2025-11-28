# Authentication Strategy - User vs Service Role

## **Two Types of Authentication Needed:**

### **1. ananyajairath (User Authentication)**
**Purpose**: User login and RLS-based access  
**How it works**:
- User signs in with `ananyajairath` credentials
- RLS policies check: `users.role = 'admin'`
- Gets admin access through user permissions

**Used for**:
- User profile management
- Client-side operations
- RLS-based data access

### **2. Service Role Key (Server Operations)**
**Purpose**: Bypass RLS for admin operations  
**How it works**:
- Hardcoded in server-side API routes
- Completely bypasses row-level security
- Admin operations work regardless of user permissions

**Used for**:
- `/api/admin/instagram/route.ts` 
- `/api/admin/courses/route.ts`
- `/api/admin/blog/route.ts`
- Any admin functionality

## **Why Both Are Needed:**

### **User Authentication (ananyajairath)**:
✅ **Security**: RLS protects data based on user permissions  
✅ **Audit Trail**: Track who did what  
✅ **Client Operations**: User can access their own data  

### **Service Role Key**:
✅ **Admin Functions**: Create/update/delete any record  
✅ **Bulk Operations**: Process multiple records  
✅ **System Operations**: Maintenance, cleanup, etc.  

## **Current Setup Should Work:**

### **Instagram Upload**:
1. User logs in as `ananyajairath`
2. Client calls `/api/admin/instagram` 
3. API uses service role key to bypass RLS
4. Creates Instagram post for that user

### **Course Creation**:
1. User logs in as `ananyajairath` 
2. Client calls `/api/admin/courses`
3. API uses service role key to bypass RLS
4. Creates course with `created_by` field

## **No Changes Needed:**
- ✅ Keep using service role key in server APIs
- ✅ Use `ananyajairath` for user login
- ✅ RLS policies check `users.role = 'admin'`
- ✅ Admin functions work through service role

**The current architecture is correct - both authentication methods work together!**