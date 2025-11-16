const mysql = require('mysql2/promise');
const dbConfig = require('./mysql-config.js');

async function testDatabaseConnection() {
  try {
    console.log('Testing MySQL connection...');
    console.log('Config:', { ...dbConfig, password: '***' });
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL successfully!');
    
    // Test database
    await connection.query('USE hotel_mahi');
    console.log('✅ Using database hotel_mahi');
    
    // Check if customers table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "customers"');
    if (tables.length > 0) {
      console.log('✅ Customers table exists');
      
      // Check if we can insert data (using correct column names)
      const testCustomerId = 'TEST-' + Date.now();
      await connection.execute(
        'INSERT INTO customers (customer_id, name, email, phone_no, street, city, landmark, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [testCustomerId, 'Test User', 'test@example.com', '1234567890', 'Test Street', 'Test City', 'Test Landmark', 'hashedpassword']
      );
      console.log('✅ Successfully inserted test customer');
      
      // Check if we can retrieve data
      const [customers] = await connection.execute('SELECT * FROM customers WHERE customer_id = ?', [testCustomerId]);
      if (customers.length > 0) {
        console.log('✅ Successfully retrieved test customer');
        console.log('Customer data:', customers[0]);
      }
      
      // Clean up test data
      await connection.execute('DELETE FROM customers WHERE customer_id = ?', [testCustomerId]);
      console.log('✅ Cleaned up test data');
    } else {
      console.log('❌ Customers table does not exist');
    }
    
    await connection.end();
    console.log('✅ Database connection test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

testDatabaseConnection();

