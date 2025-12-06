# Database Update Instructions

To enable the new course details (Instructor Bio, Learning Outcomes, Requirements, etc.), you must update your Supabase database schema.

Please follow these steps:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project.
3. Go to the **SQL Editor** (the icon looks like a terminal/code block on the left sidebar).
4. Click **New Query**.
5. Copy and paste the following SQL code into the editor:

```sql
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS instructor_bio text,
ADD COLUMN IF NOT EXISTS learning_outcomes text[],
ADD COLUMN IF NOT EXISTS requirements text[],
ADD COLUMN IF NOT EXISTS preview_video_url text,
ADD COLUMN IF NOT EXISTS syllabus_url text,
ADD COLUMN IF NOT EXISTS total_students integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating numeric(2,1) DEFAULT 4.8;
```

6. Click **Run** (or `Ctrl+Enter`).
7. Once successful, the new fields will work in the Admin Dashboard.
