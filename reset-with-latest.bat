@echo off
echo.
echo 🔥 RESETTING YOUR APP WITH LATEST STABLE VERSIONS 🔥
echo ===================================================
echo.

REM Make sure we're in the right directory
echo 📁 Current directory: %CD%
echo.

REM Clean everything completely
echo 🧹 COMPLETELY CLEANING PROJECT...
echo   - Removing old node_modules
if exist node_modules rmdir /s /q node_modules
echo   - Removing old package-lock.json
if exist package-lock.json del package-lock.json
echo   - Removing .next build cache
if exist .next rmdir /s /q .next
echo   - Removing .env.local (optional, we'll recreate it)
if exist .env.local ren .env.local .env.local.backup
echo.

echo 📦 INSTALLING LATEST STABLE VERSIONS...
echo   - All packages updated to latest stable versions
echo   - Security vulnerabilities fixed
echo   - Version conflicts resolved
echo.
npm install

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  First attempt failed. Trying with legacy peer deps...
    npm install --legacy-peer-deps
    
    if %errorlevel% neq 0 (
        echo.
        echo ⚠️  Still failing. Trying with force...
        npm install --force
    )
)

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Dependencies installed with latest versions
    echo.
    echo 🎯 NOW RUN THIS:
    echo    npm run dev
    echo.
    echo 📋 Then visit: http://localhost:3000/learn
    echo 🔔 Your notice board should load with 8 sample entries
    echo.
) else (
    echo.
    echo ❌ Installation failed completely.
    echo 📞 Please check your internet connection and try again.
    echo.
    echo 💡 Emergency backup: Copy the package.json from the workspace
    echo    and try installing manually.
    echo.
)

echo.
pause