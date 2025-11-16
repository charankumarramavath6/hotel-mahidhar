const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function showAvailableRooms() {
  try {
    console.log('🏨 Hotel Mahi - Available Rooms\n');
    console.log('=' .repeat(50));
    
    // Get all rooms
    const response = await fetch(`${API_BASE}/rooms`);
    const rooms = await response.json();
    
    if (rooms && rooms.length > 0) {
      console.log(`📊 Total Rooms: ${rooms.length}\n`);
      
      // Group rooms by status
      const availableRooms = rooms.filter(room => room.status === 'available');
      const bookedRooms = rooms.filter(room => room.status === 'booked');
      
      console.log(`✅ Available Rooms: ${availableRooms.length}`);
      console.log(`❌ Booked Rooms: ${bookedRooms.length}\n`);
      
      // Show available rooms
      if (availableRooms.length > 0) {
        console.log('\n🏨 AVAILABLE ROOMS:');
        console.log('-'.repeat(50));
        
        availableRooms.forEach((room, index) => {
          console.log(`${index + 1}. Room ${room.room_no}`);
          console.log(`   Type: ${room.type}`);
          console.log(`   Capacity: ${room.capacity} guests`);
          console.log(`   Price: ₹${room.price}/night`);
          console.log(`   Rating: ${room.rating}★`);
          console.log(`   Location: ${room.location}`);
          console.log('');
        });
      }
      
      // Show booked rooms
      if (bookedRooms.length > 0) {
        console.log('\n🚫 BOOKED ROOMS:');
        console.log('-'.repeat(50));
        
        bookedRooms.forEach((room, index) => {
          console.log(`${index + 1}. Room ${room.room_no} - ${room.type} (Booked)`);
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
        console.log(`${type}: ${stats.available}/${stats.total} available (${stats.booked} booked)`);
      });
      
    } else {
      console.log('❌ No rooms found');
    }
    
  } catch (error) {
    console.error('❌ Error fetching rooms:', error.message);
    console.log('\n💡 Make sure the server is running:');
    console.log('   node server.js');
  }
}

async function testUserRegistrationAndRooms() {
  try {
    console.log('\n🧪 Testing User Registration and Room Access...\n');
    
    // Test registration
    const registrationData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      phone_no: '+91 9876543210',
      street: '123 Test Street',
      city: 'Indore',
      landmark: 'Near Test Mall'
    };
    
    console.log('📝 Registering new user...');
    const regResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });
    
    if (regResponse.ok) {
      const regResult = await regResponse.json();
      console.log('✅ User registered successfully!');
      console.log(`   Customer ID: ${regResult.customer_id}`);
      
      // Test login
      console.log('\n🔐 Testing login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'password123'
        })
      });
      
      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('✅ Login successful!');
        console.log(`   Token: ${loginResult.token.substring(0, 20)}...`);
        
        // Test room availability for logged-in user
        console.log('\n🏨 Testing room access for logged-in user...');
        const roomsResponse = await fetch(`${API_BASE}/rooms`, {
          headers: {
            'Authorization': `Bearer ${loginResult.token}`
          }
        });
        
        if (roomsResponse.ok) {
          const userRooms = await roomsResponse.json();
          console.log(`✅ User can access ${userRooms.length} rooms`);
          
          // Show available rooms for this user
          const availableForUser = userRooms.filter(room => room.status === 'available');
          console.log(`🏨 Available rooms for this user: ${availableForUser.length}`);
          
          availableForUser.forEach(room => {
            console.log(`   - ${room.room_no}: ${room.type} (₹${room.price}/night)`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

async function main() {
  console.log('🚀 Hotel Mahi Room Availability Checker\n');
  
  // Show all available rooms
  await showAvailableRooms();
  
  // Test user-specific room access
  await testUserRegistrationAndRooms();
  
  console.log('\n' + '='.repeat(50));
  console.log('🌐 To view rooms in browser: http://localhost:3000');
  console.log('📱 Navigate to "Rooms" section to see available rooms');
  console.log('🔐 Login to book rooms and see your bookings');
}

main().catch(console.error);
