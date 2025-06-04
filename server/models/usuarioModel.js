//models/usuarioModel.js
import pool from '../config/db.js';

export async function insertUser(nombre, email, passwordHash, rol = 'usuario') {
  const [r] = await pool.query(
    `INSERT INTO usuario
       (nombre, email, password_hash, rol)
     VALUES (?,?,?,?)`,
    [nombre, email, passwordHash, rol]
  );
  return r.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT * FROM usuario
      WHERE email=? AND deleted_at IS NULL`,
    [email]
  );
  return rows[0] || null;
}

export async function softDeleteUser(id) {
  await pool.query(
    `UPDATE usuario
        SET deleted_at = NOW()
      WHERE id_usuario=?`,
    [id]
  );
}