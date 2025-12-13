# Wallet System Database Migration

To enable the wallet system, you need to add the `wallet_balance` column to your `users` table in Supabase.

Run the following SQL in your Supabase SQL Editor:

```sql
-- Add wallet_balance column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10, 2) DEFAULT 0.00;
```

This is required for the wallet recharge functionality to work.
