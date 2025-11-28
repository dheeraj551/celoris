# Supabase Environment Variables Setup

## Critical: Add these to your Vercel Environment Variables

### Required Environment Variables for Vercel Dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=https://suaqywhmaheoansrinzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDAsImV4cCI6MjA3ODc5MTEwMH0.UBkJ-Cx6fRNQucvSQS47XY2Nn6ktj_pZQRa7UiTQhf4
SUPABASE_URL=https://suaqywhmaheoansrinzw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDAsImV4cCI6MjA3ODc5MTEwMH0.UBkJ-Cx6fRNQucvSQS47XY2Nn6ktj_pZQRa7UiTQhf4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIxNTEwMCwiZXhwIjoyMDc4NzkxMTAwfQ.8Y8Y6Zf7n5TqH6sZb8cE1mI4sC6f5V2W8j9l3N5Q6f
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIxNTEwMCwiZXhwIjoyMDc4NzkxMTAwfQ.8Y8Y6Zf7n5TqH6sZb8cE1mI4sC6f5V2W8j9l3N5Q6f
```

### Environment Variable Usage:
- **Client-side (NEXT_PUBLIC_*)**: Used in browser components
- **Server-side only**: Used in API routes and server components
- **ANON key**: For public operations (safe in client)
- **SERVICE_ROLE_KEY**: For admin operations (server-only, never in client)

## Security Rules:
1. NEVER put service role keys in client-side code
2. ALWAYS use anon keys in client components
3. Keep service role keys for server-side admin operations only
