const mysql = require('mysql2/promise');

async function setupMySQL() {
  try {
    // Try connecting without password first
    console.log('Attempting to connect to MySQL without password...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    
    console.log('Connected to MySQL successfully!');
    
    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS hotel_mahi');
    console.log('Database hotel_mahi created/verified');
    
    // Use the database
    await connection.execute('USE hotel_mahi');
    console.log('Using database hotel_mahi');
    
    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Customers table created/verified');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        room_no VARCHAR(20),
        checkin_date DATE,
        checkout_date DATE,
        guests INT,
        total_amount DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('Bookings table created/verified');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS service_bookings (
        service_booking_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        service_id VARCHAR(20),
        booking_date DATE,
        booking_time TIME,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('Service bookings table created/verified');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS parking_bookings (
        parking_booking_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        vehicle_no VARCHAR(20),
        parking_spot VARCHAR(20),
        booking_date DATE,
        start_time TIME,
        end_time TIME,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('Parking bookings table created/verified');
    
    await connection.end();
    console.log('MySQL setup completed successfully!');
    return true;
    
  } catch (error) {
    console.error('MySQL setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nMySQL access denied. Please check:');
      console.log('1. MySQL is running');
      console.log('2. Root password is correct');
      console.log('3. User has proper permissions');
    }
    
    return false;
  }
}

setupMySQL();

