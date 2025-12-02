-- Check if users table has data
SELECT count(*) as user_count FROM users;

-- Check a few users to see their profile_pic_url format
SELECT id, username, profile_pic_url FROM users LIMIT 5;

-- Check if avatars bucket exists and is public
SELECT id, name, public FROM storage.buckets WHERE name = 'avatars';

-- Check policies on storage.objects (this is where storage RLS lives)
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';
