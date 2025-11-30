@echo off
echo 🔧 Fixing npm dependency issues...

REM Clean up existing dependencies
echo 🧹 Cleaning up existing node_modules and lock files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Install dependencies with legacy peer deps to resolve conflicts
echo 📦 Installing dependencies with resolved version conflicts...
npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ⚠️  Trying with --force flag...
    npm install --force
)

if %errorlevel% equ 0 (
    echo.
    echo ✅ Fix complete! Now try: npm run dev
    echo 🎯 Then visit: http://localhost:3000/learn
) else (
    echo ❌ Installation failed. Please check the error messages above.
)

pause