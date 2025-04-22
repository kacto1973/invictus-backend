import express from 'express';
const router = express.Router();
import {
    datosNotificaciones,
    eliminarNotificacion,
    cambiarNotificacionALeido,
    cambiarTodasLasNotificacionesALeido
} from '../controllers/notificacionesController.js';

router.get('/', datosNotificaciones)
router.post('/eliminar', eliminarNotificacion);
router.post('/leido', cambiarNotificacionALeido);
router.post('/leidoTodas', cambiarTodasLasNotificacionesALeido);

export default router;