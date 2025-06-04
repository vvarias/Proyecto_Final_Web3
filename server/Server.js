// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import rutas from './routes/Routes.js';

const PORT = process.env.PORT || 3000;
const FRONT = 'http://localhost:5173';

const app = express();

// 1) Configurar sesiones (para almacenar el texto del CAPTCHA)
app.use(session({
  secret: process.env.SESSION_SECRET || 'otro-secreto-fuerte',
  resave: false,
  saveUninitialized: true,
  ccookie: {
  secure: false,    // en producción usa true si tienes HTTPS
  httpOnly: true
},
saveUninitialized: false // no guardes sesiones vacías // en producción con HTTPS pon secure: true
}));

// 2) CORS
app.use(cors({
  origin: FRONT,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// 3) Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4) Rutas
app.use('/api', rutas);

// 5) Catch all 404
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

// 6) Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}/api`);
});