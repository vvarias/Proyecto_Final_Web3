//models/medModel.js
import pool from '../config/db.js';

export async function fetchMedicamentos() {
  const [rows] = await pool.query(
    'SELECT * FROM medicamento WHERE deleted_at IS NULL'
  );
  return rows;
}

export async function insertMedicamento(nombre, dosis, frecuencia, hora_inicio) {
  const [r] = await pool.query(
    `INSERT INTO medicamento
       (nombre, dosis, frecuencia, hora_inicio)
     VALUES (?,?,?,?)`,
    [nombre, dosis, frecuencia, hora_inicio]
  );
  return r.insertId;
}

export async function updateMedicamentoById(id, nombre, dosis, frecuencia, hora_inicio) {
  await pool.query(
    `UPDATE medicamento
       SET nombre=?, dosis=?, frecuencia=?, hora_inicio=?
     WHERE id_medicamento=?`,
    [nombre, dosis, frecuencia, hora_inicio, id]
  );
}

export async function softDeleteMedicamento(id) {
  await pool.query(
    `UPDATE medicamento
        SET deleted_at = NOW()
      WHERE id_medicamento=?`,
    [id]
  );
}

export async function fetchRegistros(id_medicamento) {
  const [rows] = await pool.query(
    `SELECT * FROM registro_medicacion
      WHERE id_medicamento=? AND deleted_at IS NULL`,
    [id_medicamento]
  );
  return rows;
}

export async function insertRegistro(id_medicamento, tomado) {
  const [r] = await pool.query(
    `INSERT INTO registro_medicacion
       (id_medicamento, tomado)
     VALUES (?,?)`,
    [id_medicamento, tomado ? 1 : 0]
  );
  return r.insertId;
}