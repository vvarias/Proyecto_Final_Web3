// server/routes/Routes.js
import express from 'express';
import { getCaptcha } from '../controllers/captchaController.js';
import { register, login, logout, authorize } from '../controllers/authController.js';
import * as compraCtrl from '../controllers/compraController.js';
import * as medCtrl    from '../controllers/medController.js';
import * as gastoCtrl  from '../controllers/gastoController.js';

const router = express.Router();

// —— CAPTCHA ——
router.get('/captcha', getCaptcha);

// —— Autenticación ——
router.post('/auth/register', register);
router.post('/auth/login',    login);
router.post('/auth/logout',   logout);

// —— Rutas protegidas (requieren token) ——
router.get('/listas',            authorize(), compraCtrl.getListas);
router.post('/listas',           authorize(), compraCtrl.createLista);
router.put('/listas/:id',        authorize(), compraCtrl.updateLista);
router.delete('/listas/:id',     authorize(), compraCtrl.deleteLista);

router.get('/listas/:id/items',  authorize(), compraCtrl.getItems);
router.post('/listas/:id/items', authorize(), compraCtrl.createItem);
router.put('/items/:id',         authorize(), compraCtrl.updateItem);
router.delete('/items/:id',      authorize(), compraCtrl.deleteItem);

router.get('/medicamentos',                 authorize(), medCtrl.getMedicamentos);
router.post('/medicamentos',                authorize(), medCtrl.createMedicamento);
router.put('/medicamentos/:id',             authorize(), medCtrl.updateMedicamento);
router.delete('/medicamentos/:id',          authorize(), medCtrl.deleteMedicamento);
router.get('/medicamentos/:id/registros',   authorize(), medCtrl.getRegistros);
router.post('/medicamentos/:id/registros',  authorize(), medCtrl.createRegistro);

router.get('/categorias',    authorize(), gastoCtrl.getCategorias);
router.post('/categorias',   authorize(), gastoCtrl.createCategoria);
router.delete('/categorias/:id', authorize(), gastoCtrl.deleteCategoria);

router.get('/gastos',       authorize(), gastoCtrl.getGastos);
router.post('/gastos',      authorize(), gastoCtrl.createGasto);
router.put('/gastos/:id',   authorize(), gastoCtrl.updateGasto);
router.delete('/gastos/:id',authorize(), gastoCtrl.deleteGasto);

export default router;