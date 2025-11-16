const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testRegistration() {
  try {
    console.log('🧪 Testing User Registration...\n');
    
    const registrationData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone_no: '+91 9876543210',
      street: '123 Main Street',
      city: 'Indore',
      landmark: 'Near Phoenix Mall'
    };
    
    console.log('📝 Registration data:', registrationData);
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('📋 Response:', result);
      return result;
    } else {
      console.log('❌ Registration failed:', result);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Registration test error:', error.message);
    return null;
  }
}

async function testLogin() {
  try {
    console.log('\n🧪 Testing User Login...\n');
    
    const loginData = {
      email: 'john.doe@example.com',
      password: 'password123'
    };
    
    console.log('📝 Login data:', loginData);
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('📋 Response:', result);
      return result;
    } else {
      console.log('❌ Login failed:', result);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Login test error:', error.message);
    return null;
  }
}

async function testBooking() {
  try {
    console.log('\n🧪 Testing Booking Creation...\n');
    
    // First login to get token
    const loginResult = await testLogin();
    if (!loginResult || !loginResult.token) {
      console.log('❌ Cannot test booking without login token');
      return;
    }
    
    const bookingData = {
      room_no: 'R101',
      checkin_date: '2024-12-01',
      checkout_date: '2024-12-03',
      no_of_members: 2,
      services: ['S-food'],
      staff_id: 'ST001',
      total_amount: 400
    };
    
    console.log('📝 Booking data:', bookingData);
    
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResult.token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Booking created successfully!');
      console.log('📋 Response:', result);
      return result;
    } else {
      console.log('❌ Booking creation failed:', result);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Booking test error:', error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Hotel Mahi API Tests\n');
  console.log('=' .repeat(50));
  
  // Test registration
  const registrationResult = await testRegistration();
  
  if (registrationResult) {
    // Test login
    const loginResult = await testLogin();
    
    if (loginResult) {
      // Test booking
      await testBooking();
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Tests completed!');
  console.log('\n💡 To test manually:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Try registering a new user');
  console.log('3. Try logging in with the registered user');
  console.log('4. Try creating a booking');
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/rooms');
    if (response.ok) {
      console.log('✅ Server is running on port 3000');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running on port 3000');
    console.log('💡 Please start the server first:');
    console.log('   node server.js');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    await runAllTests();
  }
}

main().catch(console.error);
