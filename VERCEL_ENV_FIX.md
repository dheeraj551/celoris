# Vercel Environment Variables Setup

## Current Issue
Your Vercel deployment is failing because the API routes need `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables, but they're missing from your Vercel project.

## Steps to Fix

### 1. Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Find your "celorisdesigns" project
3. Click on it

### 2. Add Environment Variables
1. Click **Settings** tab
2. Go to **Environment Variables** section
3. Add these two variables:

#### Variable 1:
- **Name:** `SUPABASE_URL`
- **Value:** `https://suaqywhmaheoansrinzw.supabase.co`
- **Environment:** Production, Preview, Development (select all)

#### Variable 2:
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4`
- **Environment:** Production, Preview, Development (select all)

### 3. Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete

## Why This Works

Your existing variables work for client-side (browser) features like:
- ✅ Social sections
- ✅ Login functionality
- ✅ Profile updates

But API routes (server-side) need these new variables:
- `NEXT_PUBLIC_*` = Available in browser (client-side)
- `SUPABASE_*` = Available on server (API routes)

## Expected Result
After adding the environment variables and redeploying:
- Your blog posts will appear on the homepage
- All API endpoints will work correctly
- No more "supabaseUrl is required" errors