#!/bin/bash

echo "🚀 Deploying RLS Fix for Admin Course Creation..."
echo "==============================================="

# Check if Supabase CLI is available
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI found - Applying database fix..."
    
    # Apply the RLS fix using Supabase CLI
    echo "Running RLS fix in database..."
    cat COMPLETE_RLS_COURSE_FIX.sql | supabase db reset --linked
    
    if [ $? -eq 0 ]; then
        echo "✅ RLS fix applied successfully!"
    else
        echo "❌ Failed to apply RLS fix via CLI"
        echo "Please run the SQL fix manually in Supabase dashboard"
    fi
else
    echo "⚠️  Supabase CLI not found"
    echo "Manual steps required:"
    echo "1. Go to https://suaqywhmaheoansrinzw.supabase.co"
    echo "2. Open SQL Editor"
    echo "3. Copy and paste COMPLETE_RLS_COURSE_FIX.sql"
    echo "4. Run the script"
fi

echo ""
echo "🧪 Testing admin API after fix..."
echo "================================"

# Test admin courses API
ADMIN_SESSION='{"id":"550e8400-e29b-41d4-a716-446655440000","email":"support@celorisdesigns.com","role":"admin","timestamp":'$(date +%s000)'}'

echo "Testing admin courses creation..."
RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" \
    -H "x-admin-session: $ADMIN_SESSION" \
    -H "Content-Type: application/json" \
    -d '{"title":"RLS Fix Test Course","subject":"Mathematics","grade_level":"Class 10th","description":"Testing RLS fix"}' \
    "http://localhost:3000/api/admin/courses" 2>/dev/null || echo "Server not running")

if [[ $RESPONSE == *"HTTP_CODE:200"* ]]; then
    echo "✅ Admin Course Creation: WORKING!"
    echo "🎉 RLS fix successful - admin can now create courses"
elif [[ $RESPONSE == *"HTTP_CODE:401"* ]]; then
    echo "❌ Admin Course Creation: STILL BLOCKED"
    echo "   This means the RLS fix wasn't applied correctly"
    echo "   Please manually run COMPLETE_RLS_COURSE_FIX.sql in Supabase"
elif [[ $RESPONSE == *"Server not running"* ]]; then
    echo "⚠️  Local server not running - can't test"
    echo "   Start with: npm run dev"
else
    echo "🤔 Unexpected response: $RESPONSE"
fi

echo ""
echo "📋 Next Steps:"
echo "==============="
echo "1. ✅ If test passed: Admin course creation now works!"
echo "2. ❌ If test failed: Check Supabase dashboard for RLS policies"
echo "3. 🔍 Browser test: Go to /admin/courses and try creating a course"
echo "4. 🚀 Success: Admin panel should now work without errors"

echo ""
echo "🔗 Useful Links:"
echo "================"
echo "• Supabase Dashboard: https://suaqywhmaheoansrinzw.supabase.co"
echo "• SQL Editor: https://suaqywhmaheoansrinzw.supabase.co/project/[your-project]/editor"
echo "• Admin Panel: https://celorisdesigns.com/admin/courses"

echo ""
echo "📖 Read RLS_COURSE_CREATION_FIX_GUIDE.md for detailed instructions"

