import express from 'express';
const router = express.Router();
import { consultarReactivos, crearReactivo } from '../controllers/reactivoController.js';

router.get('/', consultarReactivos)
router.post('/crearReactivo', crearReactivo);

export default router;