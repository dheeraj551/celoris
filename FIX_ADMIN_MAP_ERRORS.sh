#!/bin/bash
# COMPREHENSIVE ADMIN MAP ERROR FIX
# This script adds optional chaining to all remaining admin map functions

echo "🔧 Fixing admin map functions that are missing optional chaining..."

# Fix apps/page.tsx
echo "📱 Fixing apps/page.tsx..."
sed -i 's/\({apps\.map(\(.*\)))/{apps?.map(\1)/g' /workspace/app/admin/apps/page.tsx
sed -i 's/\({integrations\.map(\(.*\)))/{integrations?.map(\1)/g' /workspace/app/admin/apps/page.tsx

# Fix automation/page.tsx  
echo "🤖 Fixing automation/page.tsx..."
sed -i 's/\({tasks\.map(\(.*\)))/{tasks?.map(\1)/g' /workspace/app/admin/automation/page.tsx
sed -i 's/\({logs\.map(\(.*\)))/{logs?.map(\1)/g' /workspace/app/admin/automation/page.tsx
sed -i 's/\({content\.map(\(.*\)))/{content?.map(\1)/g' /workspace/app/admin/automation/page.tsx

# Fix blog/page.tsx
echo "📝 Fixing blog/page.tsx..."
sed -i 's/\({categories\.map(\(.*\)))/{categories?.map(\1)/g' /workspace/app/admin/blog/page.tsx
sed -i 's/\({posts\.map(\(.*\)))/{posts?.map(\1)/g' /workspace/app/admin/blog/page.tsx

# Fix earn/page.tsx
echo "💼 Fixing earn/page.tsx..."
sed -i 's/\({jobs\.map(\(.*\)))/{jobs?.map(\1)/g' /workspace/app/admin/earn/page.tsx
sed -i 's/\({applications\.map(\(.*\)))/{applications?.map(\1)/g' /workspace/app/admin/earn/page.tsx

# Fix inquiries/page.tsx
echo "❓ Fixing inquiries/page.tsx..."
sed -i 's/\({filteredInquiries\.map(\(.*\)))/{filteredInquiries?.map(\1)/g' /workspace/app/admin/inquiries/page.tsx

# Fix learn/page.tsx (CRITICAL!)
echo "🎓 Fixing learn/page.tsx..."
sed -i 's/\({courses\.map(\(.*\)))/{courses?.map(\1)/g' /workspace/app/admin/learn/page.tsx
sed -i 's/\({inquiries\.slice(\(.*\))\.map(\(.*\)))/{inquiries?.slice(\1).map(\2)/g' /workspace/app/admin/learn/page.tsx

# Fix testimonials/page.tsx
echo "💬 Fixing testimonials/page.tsx..."
sed -i 's/\({testimonials\.map(\(.*\)))/{testimonials?.map(\1)/g' /workspace/app/admin/testimonials/page.tsx

echo "✅ All admin map functions fixed with optional chaining!"

# Create backup
cp -r /workspace/app/admin /workspace/app/admin.backup.$(date +%Y%m%d_%H%M%S)

echo "🛡️  Backup created in: /workspace/app/admin.backup.$(date +%Y%m%d_%H%M%S)"