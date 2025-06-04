//models/accessLogModel.js
import pool from '../config/db.js';

export async function insertLog(userId, ip, event, browser) {
  await pool.query(
    `INSERT INTO access_log
       (user_id, ip, event, browser)
     VALUES (?,?,?,?)`,
    [userId, ip, event, browser]
  );
}