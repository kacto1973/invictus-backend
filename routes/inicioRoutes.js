import express from 'express';
const router = express.Router();
import { devolverDatosInicio } from '../controllers/inicioController.js';

router.get('/', devolverDatosInicio)

export default router;