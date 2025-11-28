#!/bin/bash

# ===========================================
# REPOSITORY CLEANUP SCRIPT
# ===========================================
# This script cleans up large files and cache
# to optimize GitHub repository size

echo "🧹 Starting repository cleanup..."

# Remove build directories
echo "📦 Removing build directories..."
rm -rf .next/
rm -rf out/
rm -rf dist/
rm -rf build/

# Remove cache directories
echo "🗂️  Removing cache directories..."
rm -rf node_modules/.cache/
rm -rf .eslintcache
rm -rf .stylelintcache
rm -rf .npm/
rm -rf node_modules/.cache/webpack/
rm -rf node_modules/.cache/terser-webpack-plugin/

# Remove log files
echo "📋 Removing log files..."
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*
rm -f lerna-debug.log*

# Remove other temporary files
echo "🧽 Removing temporary files..."
rm -f *.log
rm -rf .tmp/
rm -rf temp/
rm -rf tmp/

# Clean Git cache if needed
echo "🔄 Cleaning Git cache..."
if git ls-files | grep -q "\.next\|out\|build"; then
    echo "Removing tracked build files from Git..."
    git rm -r --cached .next/ out/ build/ 2>/dev/null || true
fi

# Show current directory size
echo ""
echo "📊 Current workspace size:"
du -sh . 2>/dev/null || echo "Unable to calculate size"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Run 'git add . && git commit -m \"Clean up build artifacts and cache\"'"
echo "   2. Push to GitHub: 'git push origin main'"
echo "   3. Future builds will use clean cache"