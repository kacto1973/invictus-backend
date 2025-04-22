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
router.post('/eliminar/:id', eliminarReporte);
router.post('/cambiarNombre/:id', cambiarNombreReporte)
router.get('/consultar/:nombre', conseguirReportesPorNombre);
router.get('/consultarPorRangoDeFechas', conseguirReportesPorRangoDeFechas);

export default router;