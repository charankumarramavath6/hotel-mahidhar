# MySQL Setup Solution for Hotel Mahi

## Current Issue
The MySQL connection is failing because the root password is not configured or unknown.

## Solutions

### Option 1: Reset MySQL Root Password (Recommended)

1. **Stop MySQL Service:**
   ```cmd
   net stop MySQL80
   ```

2. **Start MySQL in Safe Mode:**
   ```cmd
   mysqld --skip-grant-tables --skip-networking
   ```

3. **In another command prompt, connect and reset password:**
   ```cmd
   mysql -u root
   ```
   Then in MySQL:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'hotelmahi123';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Restart MySQL normally:**
   ```cmd
   net stop MySQL80
   net start MySQL80
   ```

5. **Update mysql-config.js:**
   ```javascript
   const MYSQL_PASSWORD = 'hotelmahi123';
   ```

### Option 2: Use MySQL Workbench

1. Open MySQL Workbench
2. Try to connect with different passwords
3. If you can connect, note the password
4. Update mysql-config.js with the working password

### Option 3: Use MySQL Installer

1. Run MySQL Installer
2. Reconfigure MySQL Server
3. Set a new root password
4. Update mysql-config.js with the new password

## After Setting Up MySQL

1. Run the setup script:
   ```cmd
   node setup-mysql-connection.js
   ```

2. Start the server:
   ```cmd
   npm start
   ```

## Alternative: Use SQLite (No MySQL Required)

If you want to avoid MySQL setup, you can use the standalone version:

```cmd
node server-standalone.js
```

This version uses SQLite and doesn't require MySQL setup.

## Testing the Setup

After setting up MySQL, test the connection:

```cmd
node test-db-connection.js
```

You should see:
- ✅ Connected to MySQL successfully!
- ✅ Using database hotel_mahi
- ✅ Customers table exists
- ✅ Successfully inserted test customer
- ✅ Successfully retrieved test customer
- ✅ Cleaned up test data
- ✅ Database connection test completed successfully!
