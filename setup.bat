@echo off
echo ========================================
echo Hotel Mahi Management System Setup
echo ========================================
echo.

echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)

echo.
echo Checking for MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MySQL not found in PATH
    echo Please make sure MySQL is installed and running
    echo You can also use XAMPP for easier setup
) else (
    echo ✅ MySQL is available
    mysql --version
)

echo.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Make sure MySQL is running
echo 2. Update database configuration in server.js if needed
echo 3. Run: npm start
echo 4. Open: http://localhost:3000
echo.
pause



