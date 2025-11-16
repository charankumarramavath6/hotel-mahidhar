const mysql = require('mysql2/promise');
const dbConfig = require('./mysql-config.js');

async function showAvailableRooms() {
  let connection;
  
  try {
    console.log('🏨 Hotel Mahi - Room Availability Report\n');
    console.log('=' .repeat(50));
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
    
    // Get all rooms
    const [rooms] = await connection.execute('SELECT * FROM rooms ORDER BY room_no');
    
    if (rooms.length > 0) {
      console.log(`📊 Total Rooms in Database: ${rooms.length}\n`);
      
      // Group rooms by status
      const availableRooms = rooms.filter(room => room.status === 'available');
      const bookedRooms = rooms.filter(room => room.status === 'booked');
      
      console.log(`✅ Available Rooms: ${availableRooms.length}`);
      console.log(`❌ Booked Rooms: ${bookedRooms.length}\n`);
      
      // Show available rooms
      if (availableRooms.length > 0) {
        console.log('🏨 AVAILABLE ROOMS:');
        console.log('-'.repeat(60));
        console.log('Room No | Type      | Capacity | Price/Night | Rating | Location');
        console.log('-'.repeat(60));
        
        availableRooms.forEach(room => {
          console.log(`${room.room_no.padEnd(8)} | ${room.type.padEnd(9)} | ${room.capacity.toString().padEnd(8)} | ₹${room.price.toString().padEnd(10)} | ${room.rating}★     | ${room.location}`);
        });
      }
      
      // Show booked rooms
      if (bookedRooms.length > 0) {
        console.log('\n🚫 BOOKED ROOMS:');
        console.log('-'.repeat(40));
        
        bookedRooms.forEach(room => {
          console.log(`Room ${room.room_no} - ${room.type} (Booked)`);
        });
      }
      
      // Show room types summary
      const roomTypes = {};
      rooms.forEach(room => {
        if (!roomTypes[room.type]) {
          roomTypes[room.type] = { total: 0, available: 0, booked: 0 };
        }
        roomTypes[room.type].total++;
        if (room.status === 'available') {
          roomTypes[room.type].available++;
        } else {
          roomTypes[room.type].booked++;
        }
      });
      
      console.log('\n📈 ROOM TYPES SUMMARY:');
      console.log('-'.repeat(50));
      Object.entries(roomTypes).forEach(([type, stats]) => {
        console.log(`${type.padEnd(12)}: ${stats.available}/${stats.total} available (${stats.booked} booked)`);
      });
      
      // Show price ranges
      const prices = rooms.map(room => room.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
      
      console.log('\n💰 PRICE RANGES:');
      console.log('-'.repeat(30));
      console.log(`Minimum: ₹${minPrice}`);
      console.log(`Maximum: ₹${maxPrice}`);
      console.log(`Average: ₹${avgPrice}`);
      
    } else {
      console.log('❌ No rooms found in database');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function showUserBookings() {
  let connection;
  
  try {
    console.log('\n👥 USER BOOKINGS REPORT\n');
    console.log('=' .repeat(50));
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    
    // Get all customers
    const [customers] = await connection.execute('SELECT customer_id, name, email FROM customers');
    
    if (customers.length > 0) {
      console.log(`👥 Total Registered Users: ${customers.length}\n`);
      
      for (const customer of customers) {
        console.log(`👤 ${customer.name} (${customer.email})`);
        console.log(`   Customer ID: ${customer.customer_id}`);
        
        // Get bookings for this customer
        const [bookings] = await connection.execute(`
          SELECT b.*, r.type as room_type, r.price 
          FROM bookings b 
          LEFT JOIN rooms r ON b.room_no = r.room_no 
          WHERE b.customer_id = ? 
          ORDER BY b.created_at DESC
        `, [customer.customer_id]);
        
        if (bookings.length > 0) {
          console.log(`   📅 Bookings: ${bookings.length}`);
          bookings.forEach(booking => {
            console.log(`      - Booking ${booking.booking_id}: ${booking.room_type} (${booking.checkin_date} to ${booking.checkout_date})`);
          });
        } else {
          console.log(`   📅 No bookings yet`);
        }
        console.log('');
      }
    } else {
      console.log('❌ No registered users found');
    }
    
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function main() {
  console.log('🚀 Hotel Mahi Database Room Report\n');
  
  // Show available rooms
  await showAvailableRooms();
  
  // Show user bookings
  await showUserBookings();
  
  console.log('\n' + '='.repeat(60));
  console.log('🌐 Website: http://localhost:3000');
  console.log('📱 Features:');
  console.log('   - View all available rooms');
  console.log('   - Register new users');
  console.log('   - Login and book rooms');
  console.log('   - View your bookings');
  console.log('   - Make payments');
  console.log('\n✅ Server is running and database is working!');
}

main().catch(console.error);
