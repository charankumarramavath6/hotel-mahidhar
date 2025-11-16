@echo off
echo Setting up MySQL for Hotel Mahi...
echo.

echo Attempting to connect to MySQL...
echo Please enter your MySQL root password when prompted.
echo If you don't have a password, just press Enter.
echo.

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS hotel_mahi; USE hotel_mahi; SHOW TABLES;"

if %errorlevel% equ 0 (
    echo.
    echo MySQL setup successful!
    echo Database 'hotel_mahi' is ready.
    echo.
    echo You can now start the server with: npm start
) else (
    echo.
    echo MySQL setup failed.
    echo Please check:
    echo 1. MySQL is running
    echo 2. You have the correct password
    echo 3. MySQL service is started
    echo.
    echo To start MySQL service, run: net start mysql
)

pause

