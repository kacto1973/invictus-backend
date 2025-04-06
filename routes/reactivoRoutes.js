import express from 'express';
const router = express.Router();
import { consultarReactivos, consultarReactivoPorId, crearReactivo, actualizarReactivo, eliminarReactivo } from '../controllers/reactivoController.js';

// Rutas publicas
router.route('/')
    .get(consultarReactivos)
    .post(crearReactivo);

router.route('/:id')
    .get(consultarReactivoPorId)
    .put(actualizarReactivo)
    .delete(eliminarReactivo);

export default router;