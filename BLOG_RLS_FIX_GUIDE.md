# Blog Posts RLS Policy Fix

## The Problem

Your blog posts weren't appearing on the homepage due to **Row Level Security (RLS) policy conflict**. The current RLS policy required **BOTH** conditions:

```sql
-- OLD POLICY (too restrictive)
CREATE POLICY "Public can view published blog posts" ON public.blog_posts
    FOR SELECT USING (is_published = true AND status = 'published');
```

### The Issue
When you created blog posts in the admin panel:
- ✅ `is_published = true` (correct)
- ❌ `status = 'draft'` (default value, but policy requires 'published')

This caused the RLS policy to block access to your posts because they didn't meet both conditions.

## The Fix

I've created `/workspace/fix_blog_rls_policies.sql` which:

1. **Updates the RLS policy** to be less restrictive - now only requires `is_published = true`
2. **Fixes existing posts** - updates any posts with `is_published = true` to have `status = 'published'`
3. **Adds proper grants** for anon and authenticated users

### How to Apply the Fix

**Option 1: Run in Supabase Dashboard**
1. Go to your Supabase project: https://suaqywhmaheoansrinzw.supabase.co
2. Navigate to "SQL Editor"
3. Copy and paste the contents of `fix_blog_rls_policies.sql`
4. Run the script

**Option 2: Using Supabase CLI (if you have it installed)**
```bash
supabase db reset
# OR
supabase db reset --linked
```

## Environment Variables (Still Required)

After fixing the RLS policy, you still need to add the environment variables to Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `SUPABASE_URL` = `https://suaqywhmaheoansrinzw.supabase.co`
   - `SUPABASE_ANON_KEY` = (your existing anon key value)

5. Redeploy your application

## What Was Fixed

✅ **API Routes** - Changed `NEXT_PUBLIC_*` to `SUPABASE_*` variables  
✅ **RLS Policies** - Fixed to allow access to published posts  
✅ **Post Status** - Updated existing posts to have correct status  
✅ **Database Permissions** - Added proper grants for public access  

After applying the RLS fix and updating Vercel environment variables, your blog posts should appear on the homepage!