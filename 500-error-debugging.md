# 🚨 500 ERROR DEBUGGING CHECKLIST

## Step 1: Check Your API File Exists
- **Pages Router**: Make sure `/pages/api/instagram-posts.ts` exists
- **App Router**: Make sure `/app/api/instagram-posts/route.ts` exists
- **Error**: If file doesn't exist, that's your problem!

## Step 2: Verify Environment Variables
Check your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://suaqywhmaheoansrinzw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Test API Directly
Use this curl command to test your API:
```bash
curl -X POST http://localhost:3000/api/instagram-posts \
  -H "Content-Type: application/json" \
  -d '{"instagram_url":"https://www.instagram.com/p/DOGnjUUkfhS/"}'
```

## Step 4: Check Browser Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try adding Instagram post
4. Click on the POST request to `/api/instagram-posts`
5. Check Response tab for detailed error message

## Step 5: Check Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to Logs > API Logs
3. Look for any errors when making Instagram posts request

## Step 6: Database Functions Check
Run this in Supabase SQL Editor:
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'create_instagram_post';
```

**Expected Result**: Should return 'create_instagram_post'

## Most Common Causes:
1. ❌ API file missing (most common)
2. ❌ Wrong Supabase URL/keys in .env.local
3. ❌ Database functions not created
4. ❌ Environment variables not loaded
5. ❌ Supabase client not initialized properly

## Quick Fix:
If API file is missing, copy the correct file from:
- **Pages Router**: Use `instagram-posts-api-complete.ts` → `/pages/api/instagram-posts.ts`
- **App Router**: Use `instagram-posts-app-router.ts` → `/app/api/instagram-posts/route.ts`