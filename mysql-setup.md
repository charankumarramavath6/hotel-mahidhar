# MySQL Database Setup for Hotel Mahi

## Option 1: Use Current SQLite Database (Easiest)

The current system uses **SQLite** which is simpler and doesn't require MySQL installation.

### View SQLite Database:
1. **DB Browser for SQLite** (Recommended)
   - Download: https://sqlitebrowser.org/
   - Install and open `hotel_mahi.db` file
   - View all tables and data

2. **VS Code Extension**
   - Install "SQLite Viewer" extension
   - Open `hotel_mahi.db` file in VS Code

3. **Command Line**
   ```bash
   sqlite3 hotel_mahi.db
   .tables
   SELECT * FROM customers;
   ```

## Option 2: Switch to MySQL

If you prefer MySQL, follow these steps:

### 1. Install MySQL
- Download MySQL Server: https://dev.mysql.com/downloads/mysql/
- Install and set up root password
- Start MySQL service

### 2. Install MySQL Dependencies
```bash
npm install mysql2
```

### 3. Configure Database
Edit `server-mysql.js` and update the database configuration:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password', // Change this
  database: 'hotel_mahi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
```

### 4. Run MySQL Version
```bash
node server-mysql.js
```

### 5. View in MySQL Workbench
- Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
- Connect to localhost MySQL server
- Browse the `hotel_mahi` database
- View all tables and data

## Database Schema

Both SQLite and MySQL versions include these tables:

- **hotels** - Hotel information
- **rooms** - Room details and availability
- **customers** - User profiles with Customer IDs
- **staff** - Hotel staff information
- **bookings** - Reservation management
- **payments** - Payment tracking
- **services** - Additional services
- **memberships** - Customer membership plans
- **vehicles** - Customer vehicle information
- **parking** - Parking spot management

## Quick Start (Recommended)

**Use the current SQLite version:**
1. Run `npm start`
2. Database file: `hotel_mahi.db` will be created
3. Download DB Browser for SQLite to view the database
4. Open `hotel_mahi.db` file to see all your data

This is the easiest way to view and manage your hotel data!



