//models/compraModel.js
import pool from '../config/db.js';

export async function fetchListas() {
  const [rows] = await pool.query(
    'SELECT * FROM lista_compra WHERE deleted_at IS NULL'
  );
  return rows;
}

export async function insertLista(nombre, creado_por) {
  const [r] = await pool.query(
    `INSERT INTO lista_compra (nombre, creado_por) VALUES (?,?)`,
    [nombre, creado_por]
  );
  return r.insertId;
}

export async function updateLista(id, nombre, creado_por) {
  await pool.query(
    `UPDATE lista_compra
       SET nombre=?, creado_por=?
     WHERE id_lista=?`,
    [nombre, creado_por, id]
  );
}

export async function softDeleteLista(id) {
  await pool.query(
    `UPDATE lista_compra
        SET deleted_at = NOW()
      WHERE id_lista=?`,
    [id]
  );
}

export async function fetchItems(id_lista) {
  const [rows] = await pool.query(
    `SELECT * FROM item_compra
      WHERE id_lista=? AND deleted_at IS NULL`,
    [id_lista]
  );
  return rows;
}

export async function insertItem(descripcion, cantidad, id_lista) {
  const [r] = await pool.query(
    `INSERT INTO item_compra
      (descripcion, cantidad, id_lista)
     VALUES (?,?,?)`,
    [descripcion, cantidad, id_lista]
  );
  return r.insertId;
}

export async function updateItemById(id, descripcion, cantidad, comprado) {
  await pool.query(
    `UPDATE item_compra
       SET descripcion=?, cantidad=?, comprado=?
     WHERE id_item=?`,
    [descripcion, cantidad, comprado ? 1 : 0, id]
  );
}

export async function softDeleteItem(id) {
  await pool.query(
    `UPDATE item_compra
        SET deleted_at = NOW()
      WHERE id_item=?`,
    [id]
  );
}