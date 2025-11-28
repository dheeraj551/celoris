#!/bin/bash

# Script to update Supabase API keys
# Usage: ./update-supabase-keys.sh

echo "=================================="
echo "Supabase API Key Updater"
echo "=================================="
echo ""

# Get new keys from user
read -p "Enter your new NEXT_PUBLIC_SUPABASE_ANON_KEY: " NEW_ANON_KEY
read -p "Enter your new SUPABASE_SERVICE_ROLE_KEY: " NEW_SERVICE_KEY

# Backup current environment file
cp .env.local .env.local.backup

# Update the environment file
sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEW_ANON_KEY|g" .env.local
sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$NEW_SERVICE_KEY|g" .env.local

echo "✅ API keys updated successfully!"
echo "📋 Backup created: .env.local.backup"
echo ""
echo "Next steps:"
echo "1. Test the connection by running: npm run dev"
echo "2. Visit http://localhost:3000/api/blog to test"
echo "3. Commit and push changes if everything works"
echo ""
echo "If there are issues, you can restore from backup with:"
echo "cp .env.local.backup .env.local"