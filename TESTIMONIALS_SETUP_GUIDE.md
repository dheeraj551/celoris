# Testimonials Database Setup - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Policy Already Exists
**Error:** `policy "Public can view visible testimonials" for table "testimonials" already exists`

**Solutions:**

#### Option A: Use the Updated Schema (Recommended)
The `testimonials_schema.sql` file has been updated to handle existing objects by using `DROP IF EXISTS` statements.

1. Run the **updated** `testimonials_schema.sql` in your Supabase SQL Editor
2. This will safely drop and recreate all objects

#### Option B: Clean Slate Approach
If you want to start completely fresh:

1. Run `cleanup_testimonials.sql` first in your Supabase SQL Editor
2. Then run the complete `testimonials_schema.sql`

### Issue 2: Function Already Exists
**Error:** `function get_testimonials_for_page already exists`

**Solution:** The updated schema handles this with `DROP FUNCTION IF EXISTS`

### Issue 3: Table Already Exists
**Error:** `relation "testimonials" already exists`

**Solution:** The updated schema handles this with `DROP TABLE IF EXISTS`

## Step-by-Step Execution

### Method 1: Clean Slate (Recommended for first setup)
```sql
-- Step 1: Clean everything
RUN: cleanup_testimonials.sql

-- Step 2: Create fresh
RUN: testimonials_schema.sql
```

### Method 2: Update Existing
```sql
-- Just run the updated schema
RUN: testimonials_schema.sql
```

## Verification
After running the script, verify with:
```sql
-- Check table exists
SELECT COUNT(*) FROM public.testimonials;

-- Test the function
SELECT get_testimonials_for_page('homepage', 'service', 5, true);
```

Both should return results without errors.