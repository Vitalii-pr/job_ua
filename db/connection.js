const mysql = require('mysql2/promise');
const dbConfig = require('./config');

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
