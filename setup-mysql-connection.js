const mysql = require('mysql2/promise');

// Common MySQL passwords to try
const commonPasswords = [
  '',           // No password
  'root',       // root
  'password',   // password
  'admin',      // admin
  '123456',     // 123456
  'mysql',      // mysql
  'Shiv@75054', // Original password from config
  'hotel123',   // hotel123
  'hotelmahi',  // hotelmahi
];

async function findMySQLPassword() {
  console.log('🔍 Trying to find MySQL password...\n');
  
  for (const password of commonPasswords) {
    try {
      console.log(`Trying password: ${password || '(empty)'}`);
      
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
        database: 'hotel_mahi'
      });
      
      console.log(`✅ SUCCESS! Password found: ${password || '(empty)'}`);
      
      // Test database operations
      await connection.execute('SELECT 1 as test');
      console.log('✅ Database connection test successful');
      
      await connection.end();
      
      // Update the config file
      const fs = require('fs');
      const configContent = `// MySQL Configuration
// Set your MySQL password here
const MYSQL_PASSWORD = '${password}'; // Found working password

module.exports = {
  host: 'localhost',
  user: 'root',
  password: MYSQL_PASSWORD,
  database: 'hotel_mahi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};`;
      
      fs.writeFileSync('mysql-config.js', configContent);
      console.log('✅ Updated mysql-config.js with working password');
      
      return password;
      
    } catch (error) {
      console.log(`❌ Failed with password: ${password || '(empty)'}`);
    }
  }
  
  console.log('\n❌ Could not find working MySQL password');
  console.log('\nPlease try one of these solutions:');
  console.log('1. Reset MySQL password using MySQL Workbench');
  console.log('2. Use MySQL Installer to reconfigure MySQL');
  console.log('3. Check if MySQL is running: net start MySQL80');
  console.log('4. Try connecting with MySQL Workbench or phpMyAdmin');
  
  return null;
}

// Also try to create database and tables if connection works
async function setupDatabase() {
  try {
    const dbConfig = require('./mysql-config.js');
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('\n🏗️  Setting up database and tables...');
    
    // Create database if not exists
    await connection.execute('CREATE DATABASE IF NOT EXISTS hotel_mahi');
    await connection.execute('USE hotel_mahi');
    console.log('✅ Database hotel_mahi created/verified');
    
    // Create customers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone_no VARCHAR(20),
        street VARCHAR(255),
        city VARCHAR(100),
        landmark VARCHAR(255),
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Customers table created/verified');
    
    // Create bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        room_no VARCHAR(20),
        checkin_date DATE,
        checkout_date DATE,
        status VARCHAR(20) DEFAULT 'pending',
        no_of_members INT,
        total_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('✅ Bookings table created/verified');
    
    // Create rooms table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rooms (
        room_no VARCHAR(20) PRIMARY KEY,
        hotel_id VARCHAR(50),
        status VARCHAR(20) DEFAULT 'available',
        price DECIMAL(10,2) NOT NULL,
        capacity INT,
        type VARCHAR(50),
        rating DECIMAL(3,1),
        location VARCHAR(255),
        image_url TEXT
      )
    `);
    console.log('✅ Rooms table created/verified');
    
    // Create services table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS services (
        service_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        charges DECIMAL(10,2),
        category VARCHAR(100),
        description TEXT,
        image_url TEXT
      )
    `);
    console.log('✅ Services table created/verified');
    
    // Create staff table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        staff_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_no VARCHAR(20),
        email VARCHAR(255),
        salary DECIMAL(10,2),
        hire_date DATE,
        supervisor_id VARCHAR(20),
        role VARCHAR(50),
        skill VARCHAR(255),
        image_url TEXT,
        FOREIGN KEY (supervisor_id) REFERENCES staff(staff_id)
      )
    `);
    console.log('✅ Staff table created/verified');
    
    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        amount DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'pending',
        mode VARCHAR(50),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
      )
    `);
    console.log('✅ Payments table created/verified');
    
    await connection.end();
    console.log('\n🎉 Database setup completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Hotel Mahi MySQL Setup\n');
  
  const password = await findMySQLPassword();
  
  if (password !== null) {
    console.log('\n📊 Setting up database tables...');
    await setupDatabase();
    
    console.log('\n✅ Setup complete! You can now run:');
    console.log('   npm start');
    console.log('   or');
    console.log('   node server.js');
  }
}

main().catch(console.error);
