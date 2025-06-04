//config/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bd_home',
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;