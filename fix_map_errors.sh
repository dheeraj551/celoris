#!/bin/bash

# AUTO FIX FOR MAP ERRORS
# This script adds safe null checks to all .map() functions

echo "🔧 Fixing map functions with null safety checks..."

# List of files to fix
files=(
    "/workspace/app/admin/courses/page.tsx"
    "/workspace/app/admin/dashboard/page.tsx"
    "/workspace/app/admin/social/page.tsx"
    "/workspace/app/learn/courses/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Fixing: $(basename "$file")"
        
        # Backup original file
        cp "$file" "$file.backup"
        
        # Add optional chaining to .map calls
        sed -i 's/\.map((/?.map((/g' "$file"
        sed -i 's/\.map(([^)]*) =>/?.map((\1) =>/g' "$file"
        
        echo "✅ Fixed: $(basename "$file")"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo ""
echo "🎉 Map function fixes applied!"
echo ""
echo "Files backed up with .backup extension"
echo "Refresh your browser to test the fix"
echo ""
echo "If something goes wrong, restore with:"
echo "cp /workspace/app/admin/courses/page.tsx.backup /workspace/app/admin/courses/page.tsx"