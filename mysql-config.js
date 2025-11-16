// MySQL Configuration
// Set your MySQL password here
const MYSQL_PASSWORD = 'Charan@123'; // Your MySQL password

module.exports = {
  host: 'localhost',
  user: 'root',
  password: MYSQL_PASSWORD,
  database: 'hotel_mahi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
