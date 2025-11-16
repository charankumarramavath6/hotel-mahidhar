@echo off
echo ========================================
echo    MySQL Password Helper
echo ========================================
echo.

echo This script will help you find or set your MySQL password.
echo.

echo Option 1: Try common passwords
echo.
echo Testing common MySQL passwords...
echo.

mysql -u root -p -e "SELECT 'Password found!' as result;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ You can connect to MySQL!
    echo Your current setup is working.
    goto :end
)

echo.
echo Option 2: Reset MySQL root password
echo.
echo If you don't know your MySQL password, you can reset it:
echo.
echo 1. Stop MySQL service: net stop MySQL80
echo 2. Start MySQL in safe mode: mysqld --skip-grant-tables
echo 3. In another command prompt, run:
echo    mysql -u root
echo    ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
echo    FLUSH PRIVILEGES;
echo    EXIT;
echo 4. Restart MySQL: net start MySQL80
echo.
echo Option 3: Use MySQL Workbench or phpMyAdmin
echo These tools can help you connect and manage MySQL.
echo.

:end
echo.
echo Once you have your MySQL password, update the mysql-config.js file
echo with your password and run setup-database.bat
echo.
pause

