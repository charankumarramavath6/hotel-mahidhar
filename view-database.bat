@echo off
echo ========================================
echo Hotel Mahi - Database Viewer
echo ========================================
echo.

echo This script will show you all the data in your MySQL database.
echo.

echo Step 1: Make sure MySQL is running
echo Step 2: Make sure the hotel_mahi database exists
echo Step 3: Check the password in view-database.js
echo.

pause

echo.
echo Running database viewer...
echo.

node view-database.js

echo.
echo Database viewing complete!
echo.
pause



