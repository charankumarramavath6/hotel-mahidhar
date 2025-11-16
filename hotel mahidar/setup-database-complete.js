const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupCompleteDatabase() {
  let connection;
  
  try {
    console.log('🚀 Setting up Hotel Mahi Database...\n');
    
    // Load database configuration
    const dbConfig = require('./mysql-config.js');
    
    // Test connection (without database first)
    console.log('🔌 Testing MySQL connection...');
    const tempConfig = { ...dbConfig };
    delete tempConfig.database; // Remove database from config for initial connection
    connection = await mysql.createConnection(tempConfig);
    console.log('✅ Connected to MySQL successfully!');
    
    // Create database
    console.log('\n📊 Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS hotel_mahi');
    await connection.query('USE hotel_mahi');
    console.log('✅ Database hotel_mahi created/verified');
    
    // Create hotels table
    console.log('\n🏨 Creating hotels table...');
    await connection.execute(`
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
    console.log('✅ Hotels table created');
    
    // Create rooms table
    console.log('\n🛏️ Creating rooms table...');
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
        image_url TEXT,
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
      )
    `);
    console.log('✅ Rooms table created');
    
    // Create customers table
    console.log('\n👥 Creating customers table...');
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
    console.log('✅ Customers table created');
    
    // Create bookings table
    console.log('\n📅 Creating bookings table...');
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
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        FOREIGN KEY (room_no) REFERENCES rooms(room_no)
      )
    `);
    console.log('✅ Bookings table created');
    
    // Create services table
    console.log('\n🛎️ Creating services table...');
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
    console.log('✅ Services table created');
    
    // Create staff table
    console.log('\n👨‍💼 Creating staff table...');
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
    console.log('✅ Staff table created');
    
    // Create payments table
    console.log('\n💳 Creating payments table...');
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
    console.log('✅ Payments table created');
    
    // Create additional tables for complete functionality
    console.log('\n🔗 Creating additional tables...');
    
    // Booking services junction table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS booking_services (
        booking_id VARCHAR(50),
        service_id VARCHAR(20),
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `);
    
    // Booking staff assignment
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS booking_staff (
        booking_id VARCHAR(50),
        staff_id VARCHAR(20),
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
        FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
      )
    `);
    
    // Service bookings table
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
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `);
    
    // Parking spots table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS parking_spots (
        spot_id VARCHAR(20) PRIMARY KEY,
        location VARCHAR(100),
        type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'available',
        price DECIMAL(10,2) DEFAULT 200
      )
    `);
    
    // Parking bookings table
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
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
        FOREIGN KEY (parking_spot) REFERENCES parking_spots(spot_id)
      )
    `);
    
    console.log('✅ Additional tables created');
    
    // Insert sample data
    console.log('\n📝 Inserting sample data...');
    
    // Insert hotel
    await connection.execute(`
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
      await connection.execute(`
        INSERT IGNORE INTO rooms (room_no, hotel_id, status, price, capacity, type, rating, location, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, room);
    }
    console.log('✅ Rooms data inserted');
    
    // Insert services
    const services = [
      ['S-food', 'In-Room Dining', 25, 'Food', '24/7 curated menu delivered to your door.', 'https://picsum.photos/seed/food/800/480'],
      ['S-spa', 'Spa & Wellness', 49, 'Membership', 'Access to sauna, pool, and gym.', 'https://picsum.photos/seed/spa/800/480'],
      ['S-parking', 'Valet Parking', 200, 'Transport', 'Secure parking with valet service.', 'https://picsum.photos/seed/parking/800/480'],
      ['S-laundry', 'Laundry Service', 15, 'Housekeeping', 'Professional laundry and dry cleaning.', 'https://picsum.photos/seed/laundry/800/480']
    ];
    
    for (const service of services) {
      await connection.execute(`
        INSERT IGNORE INTO services (service_id, name, charges, category, description, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, service);
    }
    console.log('✅ Services data inserted');
    
    // Insert staff
    const staff = [
      ['ST001', 'Santhosh', '+91 98765 43210', 'santhosh@hotelmahi.in', 45000, '2023-01-15', null, 'Chef', 'Gourmet Dining', 'assets/staff/santhosh.jpg'],
      ['ST002', 'Pankaj', '+91 98765 43211', 'pankaj@hotelmahi.in', 35000, '2023-02-01', null, 'Concierge', 'City Assistance', 'assets/staff/pankaj.jpg'],
      ['ST003', 'Soumya', '+91 98765 43212', 'soumya@hotelmahi.in', 40000, '2023-01-20', null, 'Spa Therapist', 'Wellness & Massage', 'assets/staff/soumya.jpg'],
      ['ST004', 'Amit', '+91 98765 43213', 'amit@hotelmahi.in', 30000, '2023-02-15', null, 'Housekeeping', 'Room Care', 'assets/staff/amit.jpg']
    ];
    
    for (const member of staff) {
      await connection.execute(`
        INSERT IGNORE INTO staff (staff_id, name, contact_no, email, salary, hire_date, supervisor_id, role, skill, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, member);
    }
    console.log('✅ Staff data inserted');
    
    // Insert parking spots
    const parkingSpots = [];
    for (let i = 1; i <= 20; i++) {
      const spotId = `P${i.toString().padStart(2, '0')}`;
      const location = i <= 10 ? 'Ground Floor' : 'Basement';
      const type = i <= 5 ? 'Premium' : 'Standard';
      const status = Math.random() > 0.3 ? 'available' : 'booked';
      parkingSpots.push([spotId, location, type, status, 200]);
    }
    
    for (const spot of parkingSpots) {
      await connection.execute(`
        INSERT IGNORE INTO parking_spots (spot_id, location, type, status, price) 
        VALUES (?, ?, ?, ?, ?)
      `, spot);
    }
    console.log('✅ Parking spots data inserted');
    
    // Create a test customer
    console.log('\n👤 Creating test customer...');
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const testCustomerId = 'TEST-' + Date.now();
    
    await connection.execute(`
      INSERT IGNORE INTO customers (customer_id, name, email, phone_no, street, city, landmark, password_hash) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [testCustomerId, 'Test User', 'test@hotelmahi.com', '+91 9876543210', 'Test Street', 'Indore', 'Test Landmark', hashedPassword]);
    
    console.log('✅ Test customer created');
    console.log(`   Email: test@hotelmahi.com`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   Customer ID: ${testCustomerId}`);
    
    await connection.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ MySQL connection established');
    console.log('✅ Database hotel_mahi created');
    console.log('✅ All tables created');
    console.log('✅ Sample data inserted');
    console.log('✅ Test customer created');
    
    console.log('\n🚀 You can now run:');
    console.log('   npm start');
    console.log('   or');
    console.log('   node server.js');
    
    console.log('\n🧪 Test the setup:');
    console.log('   node test-db-connection.js');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Make sure MySQL is running: net start MySQL80');
    console.error('2. Check your MySQL password in mysql-config.js');
    console.error('3. Try running: node setup-mysql-connection.js');
    console.error('4. Or use the standalone version: node server-standalone.js');
    
    if (connection) {
      await connection.end();
    }
    
    return false;
  }
}

setupCompleteDatabase();
