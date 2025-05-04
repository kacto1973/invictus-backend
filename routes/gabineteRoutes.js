import express from 'express';
const router = express.Router();
import consultarGabinetes from '../controllers/gabineteController.js';

// Rutas publicas
router.get('/', consultarGabinetes);

export default router;