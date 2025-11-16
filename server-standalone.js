const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hotel-mahi-secret-key-2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

// Generate service booking ID
const generateServiceBookingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SBOOK-${timestamp}-${random}`;
};

// Generate parking booking ID
const generateParkingBookingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PBOOK-${timestamp}-${random}`;
};

// Static data
const staticRooms = [
  { room_no: 'R101', hotel_id: 'HM-IND-0001', status: 'available', price: 189, capacity: 2, type: 'Deluxe', rating: 4.7, location: 'East Wing, Level 10', image_url: 'https://images.unsplash.com/photo-1501117716987-c8e4b1bd7a5c?q=80&w=800&auto=format&fit=crop' },
  { room_no: 'R102', hotel_id: 'HM-IND-0001', status: 'booked', price: 329, capacity: 4, type: 'Suite', rating: 4.9, location: 'North Tower, Level 18', image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop' },
  { room_no: 'R103', hotel_id: 'HM-IND-0001', status: 'available', price: 239, capacity: 4, type: 'Family', rating: 4.5, location: 'Garden Annex, Level 3', image_url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=800&auto=format&fit=crop' },
  { room_no: 'R104', hotel_id: 'HM-IND-0001', status: 'available', price: 129, capacity: 2, type: 'Standard', rating: 4.2, location: 'Main, Level 6', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop' },
  { room_no: 'R105', hotel_id: 'HM-IND-0001', status: 'booked', price: 599, capacity: 2, type: 'Suite', rating: 5.0, location: 'Skyline, Level 30', image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop' }
];

const staticServices = [
  { service_id: 'S-food', name: 'In-Room Dining', charges: 100, category: 'Food', description: '24/7 curated menu delivered to your door.', image_url: 'https://hizonscatering.com/wp-content/uploads/2017/07/catering-1.jpg' },
  { service_id: 'S-spa', name: 'Spa & Wellness', charges: 49, category: 'Membership', description: 'Access to sauna, pool, and gym.', image_url: 'https://www.picpedia.org/chalkboard/images/membership.jpg' },
  { service_id: 'S-parking', name: 'Valet Parking', charges: 50, category: 'Transport', description: 'Secure parking with valet service.', image_url: 'https://tse4.mm.bing.net/th/id/OIP.V_AARO0SHi5ppjkN776TMgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3' },
  { service_id: 'S-laundry', name: 'Laundry Service', charges: 40, category: 'Housekeeping', description: 'Professional laundry and dry cleaning.', image_url: 'https://careertraining.ed2go.com/common/images/1/19341/basic-housekeeping-935x572.jpg' }
];

const staticStaff = [
  { staff_id: 'ST001', name: 'Santhosh', role: 'Chef', skill: 'Gourmet Dining', image_url: 'assets/staff/santhosh.jpg' },
  { staff_id: 'ST002', name: 'Pankaj', role: 'Concierge', skill: 'City Assistance', image_url: 'assets/staff/pankaj.jpg' },
  { staff_id: 'ST003', name: 'Soumya', role: 'Spa Therapist', skill: 'Wellness & Massage', image_url: 'assets/staff/soumya.jpg' },
  { staff_id: 'ST004', name: 'Amit', role: 'Housekeeping', skill: 'Room Care', image_url: 'assets/staff/amit.jpg' }
];

// Generate parking spots
const generateParkingSpots = () => {
  const spots = [];
  for (let i = 1; i <= 20; i++) {
    const spotId = `P${i.toString().padStart(2, '0')}`;
    const location = i <= 10 ? 'Ground Floor' : 'Basement';
    const type = i <= 5 ? 'Premium' : 'Standard';
    const status = Math.random() > 0.3 ? 'available' : 'booked';
    spots.push({ spot_id: spotId, location, type, status, price: 200 });
  }
  return spots;
};

// API Routes

// Customer Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone_no, password, street, city, landmark } = req.body;
    
    const customerId = generateCustomerId();
    const token = jwt.sign(
      { customer_id: customerId, email: email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Customer registered successfully (Demo Mode)',
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
    
    const customerId = generateCustomerId();
    const token = jwt.sign(
      { customer_id: customerId, email: email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful (Demo Mode)',
      customer_id: customerId,
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
    
    res.json({
      customer_id: customerId,
      name: 'Demo User',
      email: req.user.email,
      phone_no: '+91 98765 43210',
      street: 'Demo Street',
      city: 'Indore',
      landmark: 'Demo Landmark'
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    res.json(staticRooms);
  } catch (error) {
    console.error('Rooms error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get available rooms
app.get('/api/rooms/available', async (req, res) => {
  try {
    const { checkin_date, checkout_date, capacity } = req.query;
    
    let rooms = staticRooms.filter(room => room.status === 'available');
    
    if (capacity) {
      rooms = rooms.filter(room => room.capacity >= parseInt(capacity));
    }
    
    res.json(rooms);
  } catch (error) {
    console.error('Available rooms error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    res.json(staticServices);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all staff
app.get('/api/staff', async (req, res) => {
  try {
    res.json(staticStaff);
  } catch (error) {
    console.error('Staff error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { room_no, checkin_date, checkout_date, no_of_members, services, staff_id, total_amount } = req.body;
    
    const bookingId = generateBookingId();
    
    res.json({
      message: 'Booking created successfully (Demo Mode)',
      booking_id: bookingId
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get customer bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    
    res.json([]);
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create payment
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { booking_id, amount, mode } = req.body;
    
    const paymentId = uuidv4();
    
    res.json({
      message: 'Payment processed successfully (Demo Mode)',
      payment_id: paymentId
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Create separate service booking
app.post('/api/service-bookings', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { service_id, booking_date, booking_time } = req.body;
    
    const service = staticServices.find(s => s.service_id === service_id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const serviceBookingId = generateServiceBookingId();
    
    res.json({
      message: 'Service booking created successfully (Demo Mode)',
      service_booking_id: serviceBookingId,
      total_amount: service.charges
    });
  } catch (error) {
    console.error('Service booking error:', error);
    res.status(500).json({ error: 'Failed to create service booking' });
  }
});

// Get customer service bookings
app.get('/api/service-bookings', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    
    res.json([]);
  } catch (error) {
    console.error('Service bookings error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get parking spots
app.get('/api/parking-spots', async (req, res) => {
  try {
    const spots = generateParkingSpots();
    res.json(spots);
  } catch (error) {
    console.error('Parking spots error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create separate parking booking
app.post('/api/parking-bookings', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { vehicle_no, parking_spot, booking_date, start_time, end_time } = req.body;
    
    const parkingBookingId = generateParkingBookingId();
    
    res.json({
      message: 'Parking booking created successfully (Demo Mode)',
      parking_booking_id: parkingBookingId,
      total_amount: 200
    });
  } catch (error) {
    console.error('Parking booking error:', error);
    res.status(500).json({ error: 'Failed to create parking booking' });
  }
});

// Get customer parking bookings
app.get('/api/parking-bookings', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    
    res.json([]);
  } catch (error) {
    console.error('Parking bookings error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Check room availability
app.get('/api/rooms/check-availability', async (req, res) => {
  try {
    const { room_no, checkin_date, checkout_date } = req.query;
    
    const room = staticRooms.find(r => r.room_no === room_no);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const isAvailable = room.status === 'available';
    
    res.json({
      room_no: room_no,
      available: isAvailable,
      room_details: room,
      conflicts: []
    });
  } catch (error) {
    console.error('Room availability check error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get membership plans
app.get('/api/membership/plans', (req, res) => {
  const plans = [
    { id: 'M1', name: 'Silver', price: 49, perks: ['5% off rooms', 'Late checkout', 'Welcome drink'] },
    { id: 'M2', name: 'Gold', price: 129, perks: ['10% off rooms', 'Free breakfast', 'Spa access'] },
    { id: 'M3', name: 'Platinum', price: 249, perks: ['15% off rooms', 'Suite upgrades', 'Concierge priority'] }
  ];
  res.json(plans);
});

// Create membership
app.post('/api/membership', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { type } = req.body;
    
    const membershipId = uuidv4();
    
    res.json({
      message: 'Membership created successfully (Demo Mode)',
      membership_id: membershipId
    });
  } catch (error) {
    console.error('Membership error:', error);
    res.status(500).json({ error: 'Failed to create membership' });
  }
});

// Get staff-service assignments
app.get('/api/staff-service-assignments', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Staff-service assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch staff-service assignments' });
  }
});

// Assign staff to service
app.post('/api/staff-service-assignments', authenticateToken, async (req, res) => {
  try {
    const { staff_id, service_id } = req.body;
    
    res.json({ message: 'Staff assigned to service successfully (Demo Mode)' });
  } catch (error) {
    console.error('Staff assignment error:', error);
    res.status(500).json({ error: 'Failed to assign staff to service' });
  }
});

// Get customer service interactions
app.get('/api/customer-service-interactions', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    
    res.json([]);
  } catch (error) {
    console.error('Customer service interactions error:', error);
    res.status(500).json({ error: 'Failed to fetch customer service interactions' });
  }
});

// Create customer service interaction
app.post('/api/customer-service-interactions', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { service_id, remarks } = req.body;
    
    res.json({ message: 'Service interaction recorded successfully (Demo Mode)' });
  } catch (error) {
    console.error('Service interaction error:', error);
    res.status(500).json({ error: 'Failed to record service interaction' });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Hotel Mahi server running on port ${PORT} (Standalone Mode)`);
  console.log(`Visit: http://localhost:${PORT}`);
  console.log('Running in demo mode without database - all bookings are simulated');
});

module.exports = app;
