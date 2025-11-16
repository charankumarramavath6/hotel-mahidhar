@echo off
echo ========================================
echo Hotel Mahi - Database Creator
echo ========================================
echo.

echo This script will create the hotel_mahi database and all tables.
echo.

echo Step 1: Make sure MySQL is running
echo Step 2: Check the password in create-database.js
echo Step 3: This will create the database and all tables
echo.

pause

echo.
echo Creating database and tables...
echo.

node create-database.js

echo.
echo Database creation complete!
echo.
echo You can now:
echo - Connect with MySQL Workbench
echo - Use phpMyAdmin
echo - Run view-database.bat to see the data
echo.
pause



