//controllers/compreController.js
import * as compraModel from '../models/compraModel.js';

export const getListas = async (req, res) => {
  try {
    const listas = await compraModel.fetchListas();
    res.json(listas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createLista = async (req, res) => {
  try {
    const { nombre, creado_por } = req.body;
    const id_lista = await compraModel.insertLista(nombre, creado_por);
    res.status(201).json({ id_lista, nombre, creado_por });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateLista = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, creado_por } = req.body;
    await compraModel.updateLista(id, nombre, creado_por);
    res.json({ message: 'Lista actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteLista = async (req, res) => {
  try {
    const { id } = req.params;
    await compraModel.softDeleteLista(id);
    res.json({ message: 'Lista eliminada (lógica) correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await compraModel.fetchItems(id);
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { descripcion, cantidad, id_lista } = req.body;
    const id_item = await compraModel.insertItem(descripcion, cantidad, id_lista);
    res.status(201).json({ id_item, descripcion, cantidad, comprado: false, id_lista });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, cantidad, comprado } = req.body;
    await compraModel.updateItemById(id, descripcion, cantidad, comprado);
    res.json({ message: 'Item actualizado correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await compraModel.softDeleteItem(id);
    res.json({ message: 'Item eliminado (lógico) correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};