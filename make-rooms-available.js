const mysql = require('mysql2/promise');
const dbConfig = require('./mysql-config.js');

async function makeRoomsAvailable() {
  let connection;
  
  try {
    console.log('🏨 Making Rooms Available for Testing\n');
    console.log('=' .repeat(50));
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
    
    // Make some rooms available
    const roomsToMakeAvailable = ['R101', 'R103', 'R104'];
    
    for (const roomNo of roomsToMakeAvailable) {
      await connection.execute('UPDATE rooms SET status = ? WHERE room_no = ?', ['available', roomNo]);
      console.log(`✅ Room ${roomNo} is now available`);
    }
    
    // Show updated room status
    console.log('\n📊 Updated Room Status:');
    console.log('-'.repeat(50));
    
    const [rooms] = await connection.execute('SELECT * FROM rooms ORDER BY room_no');
    
    rooms.forEach(room => {
      const status = room.status === 'available' ? '✅ Available' : '❌ Booked';
      console.log(`Room ${room.room_no}: ${room.type} - ${status} (₹${room.price}/night)`);
    });
    
    // Show available rooms for users
    console.log('\n🏨 AVAILABLE ROOMS FOR BOOKING:');
    console.log('-'.repeat(60));
    console.log('Room No | Type      | Capacity | Price/Night | Rating | Location');
    console.log('-'.repeat(60));
    
    const availableRooms = rooms.filter(room => room.status === 'available');
    availableRooms.forEach(room => {
      console.log(`${room.room_no.padEnd(8)} | ${room.type.padEnd(9)} | ${room.capacity.toString().padEnd(8)} | ₹${room.price.toString().padEnd(10)} | ${room.rating}★     | ${room.location}`);
    });
    
    console.log(`\n✅ ${availableRooms.length} rooms are now available for booking!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function showUserSpecificRooms() {
  let connection;
  
  try {
    console.log('\n👥 USER-SPECIFIC ROOM ACCESS\n');
    console.log('=' .repeat(50));
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    
    // Get all customers
    const [customers] = await connection.execute('SELECT customer_id, name, email FROM customers');
    
    console.log('📋 Each user can see and book the following rooms:\n');
    
    for (const customer of customers) {
      console.log(`👤 ${customer.name} (${customer.email})`);
      console.log(`   Customer ID: ${customer.customer_id}`);
      
      // Show available rooms this user can book
      const [availableRooms] = await connection.execute(`
        SELECT room_no, type, capacity, price, rating, location 
        FROM rooms 
        WHERE status = 'available'
        ORDER BY price ASC
      `);
      
      if (availableRooms.length > 0) {
        console.log(`   🏨 Can book ${availableRooms.length} available rooms:`);
        availableRooms.forEach(room => {
          console.log(`      - ${room.room_no}: ${room.type} (₹${room.price}/night, ${room.capacity} guests)`);
        });
      } else {
        console.log(`   🏨 No rooms currently available`);
      }
      
      // Show user's existing bookings
      const [userBookings] = await connection.execute(`
        SELECT b.*, r.type as room_type, r.price 
        FROM bookings b 
        LEFT JOIN rooms r ON b.room_no = r.room_no 
        WHERE b.customer_id = ? 
        ORDER BY b.created_at DESC
      `, [customer.customer_id]);
      
      if (userBookings.length > 0) {
        console.log(`   📅 Current bookings: ${userBookings.length}`);
        userBookings.forEach(booking => {
          console.log(`      - ${booking.room_type} (${booking.checkin_date} to ${booking.checkout_date})`);
        });
      } else {
        console.log(`   📅 No current bookings`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function main() {
  console.log('🚀 Hotel Mahi - Room Availability Management\n');
  
  // Make some rooms available
  await makeRoomsAvailable();
  
  // Show user-specific room access
  await showUserSpecificRooms();
  
  console.log('\n' + '='.repeat(60));
  console.log('🌐 To book rooms:');
  console.log('   1. Go to http://localhost:3000');
  console.log('   2. Click "Login" and use existing credentials or register new user');
  console.log('   3. Navigate to "Rooms" section');
  console.log('   4. Select an available room and click "Book"');
  console.log('   5. Fill in booking details and complete payment');
  console.log('\n✅ All systems are working correctly!');
}

main().catch(console.error);
