#!/usr/bin/env node

/**
 * Database Creation Script for Hotel Mahi
 * This script creates the database and all tables
 */

const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Shiv@75054', // MySQL password
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function createDatabase() {
  let connection;
  
  try {
    console.log('🔗 Connecting to MySQL server...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server!\n');

    // Create database
    console.log('📊 Creating database hotel_mahi...');
    await connection.query('CREATE DATABASE IF NOT EXISTS hotel_mahi');
    await connection.query('USE hotel_mahi');
    console.log('✅ Database hotel_mahi created!\n');

    // Create tables
    console.log('🏗️  Creating tables...');
    
    // Hotels table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        hotel_id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating DECIMAL(3,1),
        city VARCHAR(100),
        landmark VARCHAR(255),
        street_name VARCHAR(255),
        contact VARCHAR(50)
      )
    `);
    console.log('✅ hotels table created');

    // Customers table
    await connection.query(`
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
    console.log('✅ customers table created');

    // Staff table
    await connection.query(`
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
    console.log('✅ staff table created');

    // Services table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        service_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        charges DECIMAL(10,2),
        category VARCHAR(100),
        description TEXT,
        image_url TEXT
      )
    `);
    console.log('✅ services table created');

    // Rooms table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        room_no VARCHAR(20) PRIMARY KEY,
        hotel_id VARCHAR(50),
        status VARCHAR(20) DEFAULT 'available',
        price DECIMAL(10,2) NOT NULL,
        capacity INT,
        type VARCHAR(50),
        rating DECIMAL(3,1),
        location VARCHAR(255),
        image_url TEXT,
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
      )
    `);
    console.log('✅ rooms table created');

    // Staff-Service Assignment Table (NEW)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff_service_assignments (
        staff_id VARCHAR(20),
        service_id VARCHAR(20),
        assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        PRIMARY KEY (staff_id, service_id),
        FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `);
    console.log('✅ staff_service_assignments table created');

    // Customer-Service Interaction Table (NEW)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customer_service_interactions (
        service_id VARCHAR(20),
        customer_id VARCHAR(50),
        service_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        remarks TEXT,
        status VARCHAR(20) DEFAULT 'completed',
        PRIMARY KEY (service_id, customer_id, service_date),
        FOREIGN KEY (service_id) REFERENCES services(service_id),
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('✅ customer_service_interactions table created');

    // Bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        booking_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        room_no VARCHAR(20),
        checkin_date DATE,
        checkout_date DATE,
        guests INT,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        FOREIGN KEY (room_no) REFERENCES rooms(room_no)
      )
    `);
    console.log('✅ bookings table created');

    // Memberships table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS memberships (
        membership_id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        type VARCHAR(50),
        start_date DATE,
        expire_date DATE,
        no_of_bookings INT DEFAULT 0,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('✅ memberships table created');

    // Vehicles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        vehicle_no VARCHAR(20) PRIMARY KEY,
        customer_id VARCHAR(50),
        brand VARCHAR(100),
        model VARCHAR(100),
        color VARCHAR(50),
        type VARCHAR(50),
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('✅ vehicles table created');

    // Parking table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS parking (
        parking_id VARCHAR(50) PRIMARY KEY,
        vehicle_no VARCHAR(20),
        time_in TIMESTAMP,
        time_out TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        FOREIGN KEY (vehicle_no) REFERENCES vehicles(vehicle_no)
      )
    `);
    console.log('✅ parking table created');

    // Payments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        amount DECIMAL(10,2),
        payment_method VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
      )
    `);
    console.log('✅ payments table created');

    // Insert sample data
    console.log('\n📊 Inserting sample data...');
    
    // Insert hotel
    await connection.query(`
      INSERT IGNORE INTO hotels (hotel_id, name, rating, city, landmark, street_name, contact) 
      VALUES ('HM-IND-0001', 'Hotel Mahi', 4.6, 'Indore', 'Near Phoenix Mall', 'Tejaji Nagar', '+91 98765 43210')
    `);
    console.log('✅ Hotel data inserted');

    // Insert rooms
    const rooms = [
      ['R101', 'HM-IND-0001', 'available', 189, 2, 'Deluxe', 4.7, 'East Wing, Level 10', 'https://images.unsplash.com/photo-1501117716987-c8e4b1bd7a5c?q=80&w=800&auto=format&fit=crop'],
      ['R102', 'HM-IND-0001', 'booked', 329, 4, 'Suite', 4.9, 'North Tower, Level 18', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop'],
      ['R103', 'HM-IND-0001', 'available', 239, 4, 'Family', 4.5, 'Garden Annex, Level 3', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=800&auto=format&fit=crop'],
      ['R104', 'HM-IND-0001', 'available', 129, 2, 'Standard', 4.2, 'Main, Level 6', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop'],
      ['R105', 'HM-IND-0001', 'booked', 599, 2, 'Suite', 5.0, 'Skyline, Level 30', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop']
    ];
    
    for (const room of rooms) {
      await connection.query(`
        INSERT IGNORE INTO rooms (room_no, hotel_id, status, price, capacity, type, rating, location, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, room);
    }
    console.log('✅ Room data inserted');

    // Insert staff
    const staff = [
      ['ST001', 'Santhosh', '+91 98765 43210', 'santhosh@hotelmahi.in', 45000, '2023-01-15', null, 'Chef', 'Gourmet Dining', 'assets/staff/santhosh.jpg'],
      ['ST002', 'Pankaj', '+91 98765 43211', 'pankaj@hotelmahi.in', 35000, '2023-02-01', null, 'Concierge', 'City Assistance', 'assets/staff/pankaj.jpg'],
      ['ST003', 'Soumya', '+91 98765 43212', 'soumya@hotelmahi.in', 40000, '2023-01-20', null, 'Spa Therapist', 'Wellness & Massage', 'assets/staff/soumya.jpg'],
      ['ST004', 'Amit', '+91 98765 43213', 'amit@hotelmahi.in', 30000, '2023-02-15', null, 'Housekeeping', 'Room Care', 'assets/staff/amit.jpg']
    ];
    
    for (const staffMember of staff) {
      await connection.query(`
        INSERT IGNORE INTO staff (staff_id, name, contact_no, email, salary, hire_date, supervisor_id, role, skill, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, staffMember);
    }
    console.log('✅ Staff data inserted');

    // Insert services
    const services = [
      ['S-food', 'In-Room Dining', 25, 'Food', '24/7 curated menu delivered to your door.', 'https://picsum.photos/seed/food/800/480'],
      ['S-spa', 'Spa & Wellness', 49, 'Membership', 'Access to sauna, pool, and gym.', 'https://picsum.photos/seed/spa/800/480'],
      ['S-parking', 'Valet Parking', 200, 'Transport', 'Secure parking with valet service.', 'https://picsum.photos/seed/parking/800/480'],
      ['S-laundry', 'Laundry Service', 15, 'Housekeeping', 'Professional laundry and dry cleaning.', 'https://picsum.photos/seed/laundry/800/480']
    ];
    
    for (const service of services) {
      await connection.query(`
        INSERT IGNORE INTO services (service_id, name, charges, category, description, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, service);
    }
    console.log('✅ Service data inserted');

    // Insert staff-service assignments
    const staffServiceAssignments = [
      ['ST001', 'S-food'], // Santhosh assigned to In-Room Dining
      ['ST002', 'S-spa'],  // Pankaj assigned to Spa & Wellness
      ['ST003', 'S-spa'],  // Soumya assigned to Spa & Wellness
      ['ST004', 'S-laundry'] // Amit assigned to Laundry Service
    ];
    
    for (const assignment of staffServiceAssignments) {
      await connection.query(`
        INSERT IGNORE INTO staff_service_assignments (staff_id, service_id, assigned_date, status)
        VALUES (?, ?, NOW(), 'active')
      `, assignment);
    }
    console.log('✅ Staff-service assignments created');

    console.log('\n🎉 Database creation completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log('   - Database: hotel_mahi');
    console.log('   - Tables: 12 tables created');
    console.log('   - Sample data: Inserted');
    console.log('   - Relation tables: Created and populated');
    
    console.log('\n🔗 You can now connect to the database using:');
    console.log('   - MySQL Workbench');
    console.log('   - phpMyAdmin');
    console.log('   - Command line');
    console.log('   - Our database viewer script');

  } catch (error) {
    console.error('❌ Database creation failed:');
    console.error('   Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check your password in the script');
    console.error('   3. Make sure you have MySQL installed');
    console.error('   4. Try using XAMPP for easier setup');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the script
console.log('🏨 Hotel Mahi Database Creator');
console.log('===============================\n');

createDatabase().catch(console.error);

