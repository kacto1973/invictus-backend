import express from 'express';
const router = express.Router();
import consultarCategorias from '../controllers/categoriaController.js';

// Rutas publicas
router.get('/', consultarCategorias);

export default router;