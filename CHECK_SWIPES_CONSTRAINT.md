# Check Swipes Constraints

The error `violates check constraint "swipes_direction_check"` means the database only accepts specific values for the `direction` column (e.g., maybe 'RIGHT' instead of 'right', or 'like' instead of 'right').

Please run this SQL to see the definition of that constraint:

```sql
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'swipes'::regclass;
```
