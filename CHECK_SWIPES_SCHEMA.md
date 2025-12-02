# Check Swipes Table Schema

Please run the following SQL query in your Supabase SQL Editor to see the columns of the `swipes` table. This will help us identify the correct column names.

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'swipes';
```
