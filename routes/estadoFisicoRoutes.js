import express from 'express';
const router = express.Router();
import consultarEstadoFisico from '../controllers/estadoFisicoController.js';

// Rutas publicas
router.get('/', consultarEstadoFisico);

export default router;