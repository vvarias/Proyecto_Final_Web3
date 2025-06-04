// server/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/usuarioModel.js';
import * as logModel  from '../models/accessLogModel.js';

const JWT_SECRET    = process.env.JWT_SECRET || 'un-secreto-fuerte';
const TOKEN_EXPIRES = '2h';

export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, captcha } = req.body;

    // 1) Validar CAPTCHA
    if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
      req.session.captcha = null;
      return res.status(400).json({ message: 'Captcha inválido' });
    }
    req.session.captcha = null;

    // 2) Validar longitud de contraseña
    if (password.length < 8) {
      return res.status(400).json({ message: 'Contraseña muy débil (mínimo 8 caracteres)' });
    }

    // 3) Verificar usuario existente
    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    // 4) Guardar usuario
    const hash = await bcrypt.hash(password, 10);
    const id_usuario = await userModel.insertUser(nombre, email, hash, rol);
    res.status(201).json({ id_usuario, nombre, email, rol });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || 'Error interno al registrar' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, captcha } = req.body;

    // 1) Validar CAPTCHA
    if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
      req.session.captcha = null;
      return res.status(400).json({ message: 'Captcha inválido' });
    }
    req.session.captcha = null;

    // 2) Buscar usuario
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      await logModel.insertLog(null, req.ip, 'fail', req.headers['user-agent']);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3) Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      await logModel.insertLog(user.id_usuario, req.ip, 'fail', req.headers['user-agent']);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 4) Crear JWT
    const token = jwt.sign(
      { sub: user.id_usuario, rol: user.rol },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES }
    );

    // 5) Log de login exitoso
    await logModel.insertLog(user.id_usuario, req.ip, 'login', req.headers['user-agent']);

    // 6) Enviar respuesta
    res.json({
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre:     user.nombre,
        email:      user.email,
        rol:        user.rol
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || 'Error interno al autenticar' });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, JWT_SECRET);
      await logModel.insertLog(payload.sub, req.ip, 'logout', req.headers['user-agent']);
    }
    res.json({ message: 'Logout correcto' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Middleware de autorización
export const authorize = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No autorizado' });

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (Array.isArray(roles) && roles.length && !roles.includes(payload.rol)) {
      return res.status(403).json({ message: 'Permiso denegado' });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
};