import express from 'express';
const router = express.Router();
import consultarUnidadMedida from '../controllers/unidadMedidaController.js';

// Rutas publicas
router.get('/', consultarUnidadMedida);

export default router;