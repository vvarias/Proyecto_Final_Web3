//controllers/medController.js
import * as medModel from '../models/medModel.js';

export const getMedicamentos = async (req, res) => {
  try {
    const meds = await medModel.fetchMedicamentos();
    res.json(meds);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createMedicamento = async (req, res) => {
  try {
    const { nombre, dosis, frecuencia, hora_inicio } = req.body;
    const id = await medModel.insertMedicamento(nombre, dosis, frecuencia, hora_inicio);
    res.status(201).json({ id_medicamento: id, nombre, dosis, frecuencia, hora_inicio });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dosis, frecuencia, hora_inicio } = req.body;
    await medModel.updateMedicamentoById(id, nombre, dosis, frecuencia, hora_inicio);
    res.json({ message: 'Medicamento actualizado correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    await medModel.softDeleteMedicamento(id);
    res.json({ message: 'Medicamento eliminado (lógico) correctamente' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getRegistros = async (req, res) => {
  try {
    const { id } = req.params;
    const regs = await medModel.fetchRegistros(id);
    res.json(regs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const createRegistro = async (req, res) => {
  try {
    const { id_medicamento, tomado } = req.body;
    const id = await medModel.insertRegistro(id_medicamento, tomado);
    res.status(201).json({ id_registro: id, id_medicamento, tomado });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};