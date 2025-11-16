#!/usr/bin/env node

/**
 * Database Viewer Script for Hotel Mahi
 * This script helps you view your MySQL database contents
 */

const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Shiv@75054', // MySQL password
  database: 'hotel_mahi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function viewDatabase() {
  let connection;
  
  try {
    console.log('🔗 Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!\n');

    // Show database info
    console.log('📊 DATABASE INFORMATION');
    console.log('======================');
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('Available databases:', databases.map(db => db.Database_name).join(', '));
    console.log('');

    // Show all tables
    console.log('📋 TABLES IN HOTEL_MAHI DATABASE');
    console.log('================================');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${Object.values(table)[0]}`);
    });
    console.log('');

    // Show table structures
    console.log('🏗️  TABLE STRUCTURES');
    console.log('====================');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📋 Table: ${tableName}`);
      console.log('-'.repeat(50));
      
      try {
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        columns.forEach(col => {
          console.log(`  ${col.Field.padEnd(20)} ${col.Type.padEnd(15)} ${col.Key.padEnd(10)} ${col.Null.padEnd(5)} ${col.Default || 'NULL'}`);
        });
      } catch (error) {
        console.log(`  Error describing table: ${error.message}`);
      }
    }

    // Show sample data from key tables
    console.log('\n\n📊 SAMPLE DATA');
    console.log('===============');

    const keyTables = ['customers', 'staff', 'rooms', 'services', 'staff_service_assignments', 'customer_service_interactions'];
    
    for (const tableName of keyTables) {
      try {
        console.log(`\n📋 ${tableName.toUpperCase()} (Sample Data)`);
        console.log('-'.repeat(60));
        
        const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 5`);
        
        if (rows.length === 0) {
          console.log('  No data found');
        } else {
          // Show column headers
          const columns = Object.keys(rows[0]);
          console.log('  ' + columns.join(' | '));
          console.log('  ' + '-'.repeat(columns.join(' | ').length));
          
          // Show data rows
          rows.forEach(row => {
            const values = columns.map(col => {
              const value = row[col];
              return value === null ? 'NULL' : String(value).substring(0, 20);
            });
            console.log('  ' + values.join(' | '));
          });
        }
      } catch (error) {
        console.log(`  Error reading ${tableName}: ${error.message}`);
      }
    }

    // Show relation queries
    console.log('\n\n🔗 RELATION QUERIES');
    console.log('===================');

    // Staff-Service Assignments
    try {
      console.log('\n👥 STAFF-SERVICE ASSIGNMENTS');
      console.log('-'.repeat(40));
      const [assignments] = await connection.execute(`
        SELECT s.name as staff_name, s.role, 
               sv.name as service_name, sv.category,
               ssa.assigned_date, ssa.status
        FROM staff_service_assignments ssa
        JOIN staff s ON ssa.staff_id = s.staff_id
        JOIN services sv ON ssa.service_id = sv.service_id
        ORDER BY ssa.assigned_date DESC
      `);
      
      if (assignments.length === 0) {
        console.log('  No assignments found');
      } else {
        assignments.forEach(assignment => {
          console.log(`  ${assignment.staff_name} (${assignment.role}) → ${assignment.service_name} (${assignment.category})`);
          console.log(`    Assigned: ${assignment.assigned_date} | Status: ${assignment.status}`);
        });
      }
    } catch (error) {
      console.log(`  Error querying assignments: ${error.message}`);
    }

    // Customer Service Interactions
    try {
      console.log('\n👤 CUSTOMER SERVICE INTERACTIONS');
      console.log('-'.repeat(40));
      const [interactions] = await connection.execute(`
        SELECT c.name as customer_name, 
               s.name as service_name, s.category,
               csi.service_date, csi.remarks, csi.status
        FROM customer_service_interactions csi
        JOIN customers c ON csi.customer_id = c.customer_id
        JOIN services s ON csi.service_id = s.service_id
        ORDER BY csi.service_date DESC
        LIMIT 10
      `);
      
      if (interactions.length === 0) {
        console.log('  No interactions found');
      } else {
        interactions.forEach(interaction => {
          console.log(`  ${interaction.customer_name} used ${interaction.service_name} (${interaction.category})`);
          console.log(`    Date: ${interaction.service_date} | Status: ${interaction.status}`);
          if (interaction.remarks) {
            console.log(`    Remarks: ${interaction.remarks}`);
          }
        });
      }
    } catch (error) {
      console.log(`  Error querying interactions: ${error.message}`);
    }

    // Database statistics
    console.log('\n\n📈 DATABASE STATISTICS');
    console.log('======================');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`${tableName.padEnd(30)}: ${count[0].count} records`);
      } catch (error) {
        console.log(`${tableName.padEnd(30)}: Error counting records`);
      }
    }

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check your password in the script');
    console.error('   3. Make sure the database exists');
    console.error('   4. Try running: npm start (to create database)');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the script
console.log('🏨 Hotel Mahi Database Viewer');
console.log('=============================\n');

viewDatabase().catch(console.error);

