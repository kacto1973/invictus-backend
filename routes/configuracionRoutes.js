import express from 'express';
import { generarRespaldo, restaurarRespaldo, upload } from '../controllers/configuracionController.js';

const router = express.Router();

router.post("/descargar", generarRespaldo);
router.post("/restaurar", upload.single("file"), restaurarRespaldo);

export default router;