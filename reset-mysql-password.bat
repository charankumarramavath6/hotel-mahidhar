@echo off
echo ========================================
echo    MySQL Password Reset Helper
echo ========================================
echo.

echo This script will help you reset your MySQL root password.
echo.

echo Step 1: Stopping MySQL service...
net stop MySQL80
if %errorlevel% neq 0 (
    echo ❌ Failed to stop MySQL service. Please run as Administrator.
    pause
    exit /b 1
)

echo ✅ MySQL service stopped.

echo.
echo Step 2: Starting MySQL in safe mode...
echo This will start MySQL without password authentication.
echo.

start /B mysqld --skip-grant-tables --skip-networking

echo ✅ MySQL started in safe mode.
echo.
echo Step 3: Waiting 5 seconds for MySQL to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 4: Resetting root password...
echo.

echo Creating password reset script...
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'hotelmahi123'; > reset_password.sql
echo FLUSH PRIVILEGES; >> reset_password.sql
echo EXIT; >> reset_password.sql

echo Running password reset...
mysql -u root < reset_password.sql

echo.
echo Step 5: Stopping MySQL safe mode...
taskkill /F /IM mysqld.exe >nul 2>&1

echo.
echo Step 6: Starting MySQL normally...
net start MySQL80

echo.
echo Step 7: Testing new password...
echo Testing connection with new password...

echo Testing MySQL connection... > test_connection.js
echo const mysql = require('mysql2/promise'); >> test_connection.js
echo const connection = await mysql.createConnection({ >> test_connection.js
echo   host: 'localhost', >> test_connection.js
echo   user: 'root', >> test_connection.js
echo   password: 'hotelmahi123' >> test_connection.js
echo }); >> test_connection.js
echo console.log('✅ Connection successful!'); >> test_connection.js
echo await connection.end(); >> test_connection.js

node test_connection.js
if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! MySQL password has been reset to: hotelmahi123
    echo.
    echo Step 8: Updating mysql-config.js...
    
    echo // MySQL Configuration > mysql-config.js
    echo // Set your MySQL password here >> mysql-config.js
    echo const MYSQL_PASSWORD = 'hotelmahi123'; // Reset password >> mysql-config.js
    echo. >> mysql-config.js
    echo module.exports = { >> mysql-config.js
    echo   host: 'localhost', >> mysql-config.js
    echo   user: 'root', >> mysql-config.js
    echo   password: MYSQL_PASSWORD, >> mysql-config.js
    echo   database: 'hotel_mahi', >> mysql-config.js
    echo   waitForConnections: true, >> mysql-config.js
    echo   connectionLimit: 10, >> mysql-config.js
    echo   queueLimit: 0 >> mysql-config.js
    echo }; >> mysql-config.js
    
    echo ✅ mysql-config.js updated with new password.
    echo.
    echo Step 9: Setting up database...
    node setup-mysql-connection.js
    
    echo.
    echo 🎉 Setup complete! You can now run:
    echo    npm start
    echo    or
    echo    node server.js
    echo.
) else (
    echo.
    echo ❌ Password reset failed. Please try manual setup.
    echo.
    echo Manual steps:
    echo 1. Open MySQL Workbench
    echo 2. Try connecting with password: hotelmahi123
    echo 3. If that doesn't work, try the manual reset process
    echo.
)

echo Cleaning up temporary files...
del reset_password.sql >nul 2>&1
del test_connection.js >nul 2>&1

echo.
echo Press any key to continue...
pause >nul
