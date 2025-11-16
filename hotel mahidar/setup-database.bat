@echo off
echo ========================================
echo    Hotel Mahi Database Setup
echo ========================================
echo.

echo This script will help you set up MySQL for Hotel Mahi.
echo.

echo Step 1: MySQL Connection Test
echo Please enter your MySQL root password when prompted.
echo If you don't have a password, just press Enter.
echo.

mysql -u root -p -e "SELECT 'MySQL connection successful' as status;"

if %errorlevel% equ 0 (
    echo.
    echo ✅ MySQL connection successful!
    echo.
    echo Step 2: Creating database and tables...
    
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hotel_mahi; USE hotel_mahi; SHOW TABLES;"
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ Database setup completed!
        echo.
        echo Step 3: Starting Hotel Mahi server...
        echo.
        echo The server will now start with MySQL database support.
        echo All user registrations and bookings will be stored in the database.
        echo.
        pause
        npm start
    ) else (
        echo.
        echo ❌ Database setup failed.
        echo Please check your MySQL permissions.
    )
) else (
    echo.
    echo ❌ MySQL connection failed.
    echo.
    echo Please check:
    echo 1. MySQL is running (MySQL80 service)
    echo 2. You have the correct root password
    echo 3. MySQL is properly installed
    echo.
    echo To start MySQL service: net start MySQL80
    echo To reset MySQL root password, run: mysql_secure_installation
    echo.
    pause
)

