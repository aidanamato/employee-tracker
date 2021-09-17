const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '9m>u4mbeJ.Tr$>Kx',
    database: 'employee_tracker'
  },
  console.log('Database connection successful')
);

module.exports = db;