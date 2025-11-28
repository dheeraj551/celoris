# 🔧 GET YOUR CORRECT SUPABASE API KEY

## The Problem
Your Supabase URL and API key are for **different projects**:

**Your URL:** `https://suaqywhmaheoansrinzw.supabase.co`  
**Your API Key:** `suaqywhmaheoanrinzwp` (wrong project!)

## How to Get the Correct API Key

### Step 1: Go to Your Supabase Project
1. Visit: https://suaqywhmaheoansrinzw.supabase.co
2. Login to your Supabase account

### Step 2: Get Your API Keys
1. Click **Settings** in the left sidebar
2. Click **API** 
3. You'll see:

**Project URL:** `https://suaqywhmaheoansrinzw.supabase.co` ✅ (correct)
**Project Reference:** `suaqywhmaheoansrinzw` ✅ (correct)  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ← **Copy this key**

**Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ← **Copy this too**

### Step 3: Verify the Key
Make sure the JWT token has `"ref": "suaqywhmaheoansrinzw"` (not `suaqywhmaheoanrinzwp`)

You can verify by:
1. Copy the anon key
2. Go to: https://jwt.io/
3. Paste the key in the "Encoded" box
4. Check the "ref" field in the payload

It should say: `"ref": "suaqywhmaheoansrinzw"`

## What This Fixes

✅ **Blog posts will appear** - API key matches your database  
✅ **All API routes will work** - No more connection errors  
✅ **Admin panel access** - You can manage your content  

## Next Steps

1. **Get the correct anon key** from your Supabase dashboard
2. **Update Vercel environment variables:**
   - `SUPABASE_URL = https://suaqywhmaheoansrinzw.supabase.co`
   - `SUPABASE_ANON_KEY = [your correct anon key]`
3. **Redeploy** your application

Your blog posts should then appear on the homepage!