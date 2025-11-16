const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const nodemailer = require('nodemailer');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hotel-mahi-secret-key-2024';

// MySQL Database Configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Shiv@75054', // MySQL password
  database: 'hotel_mahi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize MySQL database tables
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create database if not exists
    await connection.query('CREATE DATABASE IF NOT EXISTS hotel_mahi');
    await connection.query('USE hotel_mahi');
    
    // Hotel table
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

    // Customer table
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

    // Membership table
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

    // Vehicle table
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

    // Booking table
    await connection.query(`
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

    // Payment table
    await connection.query(`
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

    // Booking services junction table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS booking_services (
        booking_id VARCHAR(50),
        service_id VARCHAR(20),
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
        FOREIGN KEY (service_id) REFERENCES services(service_id)
      )
    `);

    // Booking staff assignment
    await connection.query(`
      CREATE TABLE IF NOT EXISTS booking_staff (
        booking_id VARCHAR(50),
        staff_id VARCHAR(20),
        FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
        FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
      )
    `);

    connection.release();
    console.log('MySQL database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database
initDatabase();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Generate customer ID
const generateCustomerId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CUST-${timestamp}-${random}`;
};

// Generate booking ID
const generateBookingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BOOK-${timestamp}-${random}`;
};

// API Routes (same as SQLite version)
// Customer Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone_no, password, street, city, landmark } = req.body;
    
    // Check if customer already exists
    const [existing] = await pool.query('SELECT customer_id FROM customers WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Customer already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Generate customer ID
    const customerId = generateCustomerId();
    
    // Insert customer
    await pool.query(
      `INSERT INTO customers (customer_id, name, email, phone_no, street, city, landmark, password_hash) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerId, name, email, phone_no, street, city, landmark, passwordHash]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { customer_id: customerId, email: email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Customer registered successfully',
      customer_id: customerId,
      token: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Customer Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [customers] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    
    if (customers.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const customer = customers[0];
    const isValidPassword = await bcrypt.compare(password, customer.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { customer_id: customer.customer_id, email: customer.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      customer_id: customer.customer_id,
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get customer profile
app.get('/api/customer/profile', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    
    const [customers] = await pool.query('SELECT * FROM customers WHERE customer_id = ?', [customerId]);
    
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const customer = customers[0];
    delete customer.password_hash;
    res.json(customer);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const [rooms] = await pool.query('SELECT * FROM rooms');
    res.json(rooms);
  } catch (error) {
    console.error('Rooms error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const [services] = await pool.query('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all staff
app.get('/api/staff', async (req, res) => {
  try {
    const [staff] = await pool.query('SELECT * FROM staff');
    res.json(staff);
  } catch (error) {
    console.error('Staff error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { room_no, checkin_date, checkout_date, guests, services, staff_id } = req.body;
    const customer_id = req.user.customer_id;
    
    // Generate booking ID
    const booking_id = generateBookingId();
    
    // Calculate total amount (room price * nights)
    const [rooms] = await pool.query('SELECT price FROM rooms WHERE room_no = ?', [room_no]);
    if (rooms.length === 0) {
      return res.status(400).json({ error: 'Room not found' });
    }
    
    const room_price = parseFloat(rooms[0].price);
    const checkin = new Date(checkin_date);
    const checkout = new Date(checkout_date);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const room_total = room_price * nights;
    
    // Calculate service costs
    let service_total = 0;
    if (services && services.length > 0) {
      const serviceIds = services.map(s => typeof s === 'string' ? s : s.service_id);
      const placeholders = serviceIds.map(() => '?').join(',');
      const [servicePrices] = await pool.query(`SELECT charges FROM services WHERE service_id IN (${placeholders})`, serviceIds);
      service_total = servicePrices.reduce((sum, service) => sum + parseFloat(service.charges), 0);
    }
    
    const total_amount = room_total + service_total;
    
    // Create booking
    await pool.query(
      `INSERT INTO bookings (booking_id, customer_id, room_no, checkin_date, checkout_date, guests, status, total_amount) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [booking_id, customer_id, room_no, checkin_date, checkout_date, guests, total_amount]
    );
    
    // Add services to booking
    if (services && services.length > 0) {
      for (const service of services) {
        const serviceId = typeof service === 'string' ? service : service.service_id;
        await pool.query(
          'INSERT INTO booking_services (booking_id, service_id) VALUES (?, ?)',
          [booking_id, serviceId]
        );
      }
    }
    
    // Add staff to booking
    if (staff_id) {
      await pool.query(
        'INSERT INTO booking_staff (booking_id, staff_id) VALUES (?, ?)',
        [booking_id, staff_id]
      );
    }
    
    res.json({
      message: 'Booking created successfully',
      booking_id: booking_id,
      total_amount: total_amount
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const customer_id = req.user.customer_id;
    const [bookings] = await pool.query(
      `SELECT b.*, r.type as room_type, r.price, r.location 
       FROM bookings b 
       LEFT JOIN rooms r ON b.room_no = r.room_no 
       WHERE b.customer_id = ? 
       ORDER BY b.created_at DESC`,
      [customer_id]
    );
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all bookings (admin)
app.get('/api/admin/bookings', async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, c.name as customer_name, c.email, r.type as room_type, r.price, r.location 
       FROM bookings b 
       LEFT JOIN customers c ON b.customer_id = c.customer_id 
       LEFT JOIN rooms r ON b.room_no = r.room_no 
       ORDER BY b.created_at DESC`
    );
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, id]);
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Staff-Service Assignments API
app.get('/api/staff-service-assignments', async (req, res) => {
  try {
    const [assignments] = await pool.query(`
      SELECT ssa.*, s.name as staff_name, s.role, sv.name as service_name, sv.category
      FROM staff_service_assignments ssa
      JOIN staff s ON ssa.staff_id = s.staff_id
      JOIN services sv ON ssa.service_id = sv.service_id
      ORDER BY ssa.assigned_date DESC
    `);
    res.json(assignments);
  } catch (error) {
    console.error('Get staff-service assignments error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/staff-service-assignments', async (req, res) => {
  try {
    const { staff_id, service_id } = req.body;
    
    await pool.query(
      'INSERT INTO staff_service_assignments (staff_id, service_id, assigned_date, status) VALUES (?, ?, NOW(), ?)',
      [staff_id, service_id, 'active']
    );
    
    res.json({ message: 'Staff-service assignment created successfully' });
  } catch (error) {
    console.error('Create staff-service assignment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Customer Service Interactions API
app.get('/api/customer-service-interactions', authenticateToken, async (req, res) => {
  try {
    const customer_id = req.user.customer_id;
    const [interactions] = await pool.query(`
      SELECT csi.*, s.name as service_name, s.category
      FROM customer_service_interactions csi
      JOIN services s ON csi.service_id = s.service_id
      WHERE csi.customer_id = ?
      ORDER BY csi.service_date DESC
    `, [customer_id]);
    res.json(interactions);
  } catch (error) {
    console.error('Get customer service interactions error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/customer-service-interactions', authenticateToken, async (req, res) => {
  try {
    const customer_id = req.user.customer_id;
    const { service_id, remarks } = req.body;
    
    await pool.query(
      'INSERT INTO customer_service_interactions (service_id, customer_id, service_date, remarks, status) VALUES (?, ?, NOW(), ?, ?)',
      [service_id, customer_id, remarks, 'completed']
    );
    
    res.json({ message: 'Service interaction recorded successfully' });
  } catch (error) {
    console.error('Record service interaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Payments API
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { booking_id, amount, mode } = req.body;
    const payment_id = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    console.log('Payment request:', { booking_id, amount, mode, payment_id });
    
    await pool.query(
      'INSERT INTO payments (payment_id, booking_id, amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [payment_id, booking_id, amount, mode, 'completed']
    );
    
    console.log('Payment inserted successfully:', payment_id);
    
    res.json({ 
      message: 'Payment processed successfully',
      payment_id: payment_id 
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Hotel Mahi MySQL server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

module.exports = app;

