// src/apis/api.js
import client from './client.js';

// ——— Auth ———
export const login    = (data) => client.post('/auth/login', data);
export const register = (data) => client.post('/auth/register', data);
export const logout   = ()     => client.post('/auth/logout');

// ——— CAPTCHA ———
export const getCaptcha = () => client.get('/captcha', { responseType: 'text' });

// ——— LISTA DE COMPRAS ———
export const getListas   = () => client.get('/listas');
export const createLista = l  => client.post('/listas', l);
export const updateLista = l  => client.put(`/listas/${l.id_lista}`, l);
export const deleteLista = id => client.delete(`/listas/${id}`);

// Ítems
export const getItems   = listaId => client.get(`/listas/${listaId}/items`);
export const createItem = i       => client.post(`/listas/${i.id_lista}/items`, i);
export const updateItem = i       => client.put(`/items/${i.id_item}`, i);
export const deleteItem = id      => client.delete(`/items/${id}`);

// ——— MEDICAMENTOS ———
export const getMedicamentos   = () => client.get('/medicamentos');
export const createMedicamento = m  => client.post('/medicamentos', m);
export const updateMedicamento = m  => client.put(`/medicamentos/${m.id_medicamento}`, m);
export const deleteMedicamento = id => client.delete(`/medicamentos/${id}`);

// Registros
export const getRegistros   = medId => client.get(`/medicamentos/${medId}/registros`);
export const createRegistro = r     => client.post(`/medicamentos/${r.id_medicamento}/registros`, r);

// ——— GASTOS ———
export const getCategorias   = ()     => client.get('/categorias');
export const createCategoria = c      => client.post('/categorias', c);
// ——— NO olvides agregar updateCategoria (faltaba en tu código original) ———
export const updateCategoria = c      => client.put(`/categorias/${c.id_categoria}`, c);
export const deleteCategoria = id     => client.delete(`/categorias/${id}`);

export const getGastos   = ()   => client.get('/gastos');
export const createGasto = g    => client.post('/gastos', g);
export const updateGasto = g    => client.put(`/gastos/${g.id_gasto}`, g);
export const deleteGasto = id   => client.delete(`/gastos/${id}`);