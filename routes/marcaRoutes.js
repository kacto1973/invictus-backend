import express from 'express';
const router = express.Router();
import consultarMarcas from '../controllers/marcaController.js';

// Rutas publicas
router.get('/', consultarMarcas);

export default router;