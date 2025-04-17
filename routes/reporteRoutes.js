import express from 'express';
const router = express.Router();
import {
    cambiarNombreReporte,
    conseguirTodosLosReportes,
    crearReporte,
    eliminarReporte
} from "../controllers/reportesController.js";

router.get('/', conseguirTodosLosReportes)
router.post('/crear', crearReporte);
router.post('/eliminar/:id', eliminarReporte);
router.post('/cambiarNombre/:id', cambiarNombreReporte)

export default router;