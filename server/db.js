// db.js (Updated)
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

async function insertLog(log) {
  return pool.query(
    `INSERT INTO sensor_logs (time, temp, hum, gas, emergency)
     VALUES ($1, $2, $3, $4, $5)`,
    [log.time, log.temp, log.hum, log.gas, log.emergency]
  );
}

async function getLogs() {
  const result = await pool.query("SELECT * FROM sensor_logs ORDER BY id ASC");
  return result.rows;
}

async function clearLogs() {
  return pool.query("TRUNCATE TABLE sensor_logs RESTART IDENTITY");
}

// *** NEW FUNCTION ***
async function deleteOldLogs(days = 5) {
  // Calculate the date object for 'now minus X days'
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // SQL query to DELETE any row where the 'time' column (assuming it's a TIMESTAMP/DATE)
  // is older than the calculated cutoff date.
  const result = await pool.query(
    `DELETE FROM sensor_logs WHERE time < $1 RETURNING *`,
    [cutoffDate]
  );
  console.log(`Deleted ${result.rowCount} old logs.`);
  return result.rowCount;
}

module.exports = {
  insertLog,
  getLogs,
  clearLogs,
  deleteOldLogs, // Export the new function
};
