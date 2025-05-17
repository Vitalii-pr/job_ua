// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',     // Change this to your MySQL username
  password: '',     // Change this to your MySQL password
  database: 'job_ua_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

module.exports = dbConfig;
