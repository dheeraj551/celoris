#!/bin/bash
# Quick fix script for npm dependency issues

echo "🔧 Fixing npm dependency issues..."

# Clean up existing dependencies
echo "🧹 Cleaning up existing node_modules and lock files..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with legacy peer deps to resolve conflicts
echo "📦 Installing dependencies with resolved version conflicts..."
npm install --legacy-peer-deps

# If that fails, try with force
if [ $? -ne 0 ]; then
    echo "⚠️  Trying with --force flag..."
    npm install --force
fi

echo "✅ Fix complete! Now try: npm run dev"