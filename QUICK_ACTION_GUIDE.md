# ⚡ QUICK ACTION GUIDE - Fix Authentication Issues

## 🚨 **DO THIS FIRST - Database Fix**

1. **Go to Supabase SQL Editor**: 
   ```
   https://supabase.com/dashboard/project/[your-project-id]/sql
   ```

2. **Copy & Paste** the entire content of `/workspace/complete-auth-fix.sql`

3. **Run** the SQL script

4. **Verify success** - You should see confirmation messages

---

## 🧪 **Test These URLs After Database Fix**

### ✅ Admin Course Creation
- **URL**: http://localhost:3000/admin/login
- **Action**: Login with `support@celorisdesigns.com`
- **Expected**: Can create courses without "Unauthorized" error

### ✅ Instagram Posting  
- **URL**: http://localhost:3000/social/profile
- **Action**: Try adding Instagram URL
- **Expected**: No UUID error (no more "23", "21")

### ✅ Learn Page
- **URL**: http://localhost:3000/learn
- **Action**: Check featured courses display
- **Expected**: Courses visible + Notice Board section

---

## 🔧 **If Still Broken**

### Check Browser Console
1. Open browser DevTools (F12)
2. Look for specific error messages
3. Check Network tab for failed API calls

### Verify Admin Session
1. Check localStorage in browser console
2. Look for `admin_session` key
3. Ensure it has proper format with timestamp

### Common Fixes
```javascript
// Clear localStorage if session is corrupted
localStorage.removeItem('admin_session');

// Then login again through admin panel
```

---

## 📞 **When All Else Fails**

1. **Restart everything**:
   ```bash
   pkill -f "npm run dev"
   npm run dev
   ```

2. **Check database policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'instagram_posts';
   ```

3. **Verify function exists**:
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_name = 'create_instagram_post';
   ```

---

## 🎯 **Success Indicators**

✅ **Instagram**: Can post without UUID errors  
✅ **Admin**: Can create courses without auth errors  
✅ **Learn**: Featured courses display properly  
✅ **Notice**: Tutor requirements section visible  

**If all 4 work = Problem Solved! 🎉**
