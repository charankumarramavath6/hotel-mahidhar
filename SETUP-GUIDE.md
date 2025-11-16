# Hotel Mahi Setup Guide

## Prerequisites Installation

### 1. Install Node.js
1. Download Node.js from: https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Restart your command prompt/PowerShell

### 2. Install MySQL
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server
3. Set up root password during installation
4. Start MySQL service

### 3. Verify Installation
Open PowerShell/Command Prompt and run:
```bash
node --version
npm --version
mysql --version
```

## Project Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MySQL Connection
Edit `server.js` and update the database configuration:
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

### 3. Start the Server
```bash
npm start
```

### 4. Access the Website
Open your browser and go to: `http://localhost:3000`

## Alternative: Use XAMPP/WAMP

If you prefer a simpler setup:

### XAMPP Setup
1. Download XAMPP from: https://www.apachefriends.org/
2. Install XAMPP
3. Start Apache and MySQL from XAMPP Control Panel
4. Access phpMyAdmin at: http://localhost/phpmyadmin
5. Create database named `hotel_mahi`

### Update Database Config
In `server.js`, update:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Usually empty for XAMPP
  database: 'hotel_mahi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
```

## Troubleshooting

### MySQL Connection Issues
1. Make sure MySQL service is running
2. Check if the password is correct
3. Verify the database name exists
4. Check firewall settings

### Port Already in Use
If port 3000 is busy, change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001 or any available port
```

### Database Not Found
The application will automatically create the database and tables on first run.

## Quick Start (After Prerequisites)

1. Open PowerShell in project folder
2. Run: `npm install`
3. Run: `npm start`
4. Open browser: `http://localhost:3000`
5. Register a new account to test the system

## Viewing Database

### MySQL Workbench
1. Download MySQL Workbench
2. Connect to localhost MySQL
3. Browse the `hotel_mahi` database
4. View all tables and data

### phpMyAdmin (if using XAMPP)
1. Go to http://localhost/phpmyadmin
2. Select `hotel_mahi` database
3. Browse tables and data

## Features Available

- User registration with Customer ID generation
- Room booking and management
- Service selection and booking
- Staff assignment
- Payment processing
- Membership management
- Real-time data storage in MySQL

The system will automatically create all necessary tables and seed initial data when you first run it.



