import express from 'express';
const router = express.Router();
import {
    cambiarNombreReporte,
    conseguirTodosLosReportes,
    crearReporte,
    eliminarReporte,
    conseguirReportesPorNombre,
    conseguirReportesPorRangoDeFechas
} from "../controllers/reportesController.js";

router.get('/', conseguirTodosLosReportes)
router.post('/crear', crearReporte);
router.post('/eliminar', eliminarReporte);
router.post('/cambiarNombre', cambiarNombreReporte)
router.get('/consultarPorNombre', conseguirReportesPorNombre);
router.get('/consultarPorFechas', conseguirReportesPorRangoDeFechas);

export default router;