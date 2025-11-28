-- Complete solution for creating admin user with foreign key constraints

-- Step 1: Check existing users to understand the pattern
SELECT id, email, username, full_name 
FROM users 
LIMIT 3;