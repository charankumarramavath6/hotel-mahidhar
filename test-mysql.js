const mysql = require('mysql2/promise');

async function testMySQL() {
  const configs = [
    { host: 'localhost', user: 'root', password: 'Shiv@75054' },
    { host: 'localhost', user: 'root', password: '' },
    { host: 'localhost', user: 'root', password: 'root' },
    { host: 'localhost', user: 'root', password: 'password' },
    { host: 'localhost', user: 'root', password: '123456' }
  ];
  
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    try {
      console.log(`Trying config ${i + 1}: user=${config.user}, password=${config.password || '(empty)'}`);
      const connection = await mysql.createConnection(config);
      console.log('✅ SUCCESS! Connected to MySQL');
      console.log('Configuration that works:', config);
      
      // Test database creation
      await connection.execute('CREATE DATABASE IF NOT EXISTS hotel_mahi');
      console.log('✅ Database hotel_mahi created/verified');
      
      await connection.end();
      return config;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
  
  console.log('❌ Could not connect to MySQL with any configuration');
  return null;
}

testMySQL();
