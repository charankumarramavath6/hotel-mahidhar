@echo off
echo ========================================
echo Hotel Mahi - Node.js Installation Helper
echo ========================================
echo.

echo This script will help you install Node.js and set up the full application.
echo.

echo Step 1: Download Node.js
echo Please download Node.js from: https://nodejs.org/
echo Choose the LTS version (recommended)
echo.
echo After downloading, run the installer and follow the setup wizard.
echo.
echo Step 2: Restart your computer after installation
echo.
echo Step 3: Run this script again to continue setup
echo.

pause

echo.
echo Checking if Node.js is now installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is still not installed!
    echo Please install Node.js first, then run this script again.
    echo.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed!
    node --version
    echo.
    echo Installing dependencies...
    npm install
    echo.
    echo ✅ Setup complete!
    echo.
    echo To start the server, run: npm start
    echo Then open: http://localhost:3000
    echo.
    pause
)



