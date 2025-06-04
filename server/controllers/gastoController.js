//controllers/gastoController.js
import * as gastoModel from '../models/gastoModel.js';

export const getCategorias = async (req, res) => {
  try {
    const cats = await gastoModel.fetchCategorias();
    res.json(cats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const id = await gastoModel.insertCategoria(nombre);
    res.status(201).json({ id_categoria: id, nombre });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await gastoModel.softDeleteCategoria(id);
    res.json({ message: 'Categoría eliminada (lógica) correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getGastos = async (req, res) => {
  try {
    const gastos = await gastoModel.fetchGastos();
    res.json(gastos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createGasto = async (req, res) => {
  try {
    const { descripcion, monto, fecha, id_categoria } = req.body;
    const id = await gastoModel.insertGasto(descripcion, monto, fecha, id_categoria);
    res.status(201).json({ id_gasto: id, descripcion, monto, fecha, id_categoria });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, monto, fecha, id_categoria } = req.body;
    await gastoModel.updateGastoById(id, descripcion, monto, fecha, id_categoria);
    res.json({ message: 'Gasto actualizado correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteGasto = async (req, res) => {
  try {
    const { id } = req.params;
    await gastoModel.softDeleteGasto(id);
    res.json({ message: 'Gasto eliminado (lógico) correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};