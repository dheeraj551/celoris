# Create Admin User via Supabase Admin API
# This script creates the admin user programmatically

import requests
import json

# Your Supabase project details
SUPABASE_URL = "https://suaqywhmaheoansrinzw.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIxNTEwMCwiZXhwIjoyMDc4NzkxMTAwfQ.8Y8Y6Zf7n5TqH6sZb8cE1mI4sC6f5V2W8j9l3N5Q6f"

def create_admin_user():
    """Create admin user through Supabase Admin API"""
    
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    
    headers = {
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "apikey": SERVICE_ROLE_KEY
    }
    
    user_data = {
        "email": "support@celorisdesigns.com",
        "password": "f3yay3qa2!oTFTpa",
        "email_confirm": True,
        "user_metadata": {
            "full_name": "Admin User",
            "role": "admin"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=user_data)
        
        if response.status_code == 201:
            user = response.json()
            print(f"✅ Admin user created successfully!")
            print(f"User ID: {user['id']}")
            print(f"Email: {user['email']}")
            print(f"\nNow run this SQL with the actual User ID:")
            print(f"INSERT INTO users (id, username, full_name, bio, subscription_status, verification_status) VALUES ('{user['id']}', 'admin', 'Admin User', 'System Administrator for AI Blog Publishing', 'premium', 'verified');")
            return user['id']
        else:
            print(f"❌ Error creating user: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception occurred: {str(e)}")
        return None

if __name__ == "__main__":
    print("Creating admin user via API...")
    admin_id = create_admin_user()
    
    if admin_id:
        print(f"\n✅ Admin user created with ID: {admin_id}")
        print("Now create the user profile in SQL Editor")
    else:
        print("Failed to create admin user")