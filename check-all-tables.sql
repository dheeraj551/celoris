-- Check all tables that might be related to Instagram
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%insta%' OR table_name LIKE '%instagram%')
ORDER BY table_name;