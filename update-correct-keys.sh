#!/bin/bash

# Script to update with correct Supabase project keys
echo "===================================="
echo "Update Supabase API Keys"
echo "===================================="
echo ""

# Get correct keys from user
echo "🎯 Please provide the CORRECT API keys from your Supabase dashboard"
echo "   (Project ID: suaqywhmaheoansrinzw)"
echo ""
read -p "Enter NEXT_PUBLIC_SUPABASE_ANON_KEY: " NEW_ANON_KEY
read -p "Enter SUPABASE_SERVICE_ROLE_KEY: " NEW_SERVICE_KEY

echo ""
echo "🔍 Verifying the keys..."

# Decode and verify project reference
python3 -c "
import base64
import json
import sys

def decode_jwt_project(token):
    try:
        payload = token.split('.')[1]
        decoded = json.loads(base64.b64decode(payload + '==').decode())
        return decoded.get('ref')
    except:
        return None

anon_project = decode_jwt_project('$NEW_ANON_KEY')
service_project = decode_jwt_project('$NEW_SERVICE_KEY')

print(f'Anon Key Project: {anon_project}')
print(f'Service Key Project: {service_project}')

if anon_project == 'suaqywhmaheoansrinzw' and service_project == 'suaqywhmaheoansrinzw':
    print('✅ Keys belong to the correct project!')
else:
    print('❌ Keys do NOT belong to the correct project!')
    print('Please make sure you copied keys from project: suaqywhmaheoansrinzw')
    sys.exit(1)
"

if [ $? -eq 0 ]; then
    # Backup current environment
    cp .env.local .env.local.backup
    
    # Update the environment file
    sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEW_ANON_KEY|g" .env.local
    sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$NEW_SERVICE_KEY|g" .env.local
    
    echo ""
    echo "✅ API keys updated successfully!"
    echo "📋 Backup created: .env.local.backup"
    echo ""
    echo "Next steps:"
    echo "1. Test locally: npm run dev"
    echo "2. Visit http://localhost:3000/api/blog"
    echo "3. Update Vercel environment variables with the same keys"
    echo "4. Deploy and test on production"
else
    echo ""
    echo "❌ Key validation failed. Please check your keys and try again."
fi