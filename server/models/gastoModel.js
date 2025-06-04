//models/gastoModel.js
import pool from '../config/db.js';

export async function fetchCategorias() {
  const [rows] = await pool.query(
    'SELECT * FROM categoria_gasto WHERE deleted_at IS NULL'
  );
  return rows;
}

export async function insertCategoria(nombre) {
  const [r] = await pool.query(
    `INSERT INTO categoria_gasto (nombre) VALUES (?)`,
    [nombre]
  );
  return r.insertId;
}

export async function softDeleteCategoria(id) {
  await pool.query(
    `UPDATE categoria_gasto
        SET deleted_at = NOW()
      WHERE id_categoria=?`,
    [id]
  );
}

export async function fetchGastos() {
  const [rows] = await pool.query(`
    SELECT g.*, c.nombre AS categoria
      FROM gasto g
 LEFT JOIN categoria_gasto c ON g.id_categoria=c.id_categoria
     WHERE g.deleted_at IS NULL
  `);
  return rows;
}

export async function insertGasto(descripcion, monto, fecha, id_categoria) {
  const [r] = await pool.query(
    `INSERT INTO gasto
       (descripcion, monto, fecha, id_categoria)
     VALUES (?,?,?,?)`,
    [descripcion, monto, fecha, id_categoria]
  );
  return r.insertId;
}

export async function updateGastoById(id, descripcion, monto, fecha, id_categoria) {
  await pool.query(
    `UPDATE gasto
       SET descripcion=?, monto=?, fecha=?, id_categoria=?
     WHERE id_gasto=?`,
    [descripcion, monto, fecha, id_categoria, id]
  );
}

export async function softDeleteGasto(id) {
  await pool.query(
    `UPDATE gasto
        SET deleted_at = NOW()
      WHERE id_gasto=?`,
    [id]
  );
}