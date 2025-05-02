import express from 'express';
const router = express.Router();
import {
    datosNotificaciones,
    eliminarNotificacion,
    cambiarNotificacionALeido,
    cambiarTodasLasNotificacionesALeido,
    eliminarTodasLasNotificaciones
} from '../controllers/notificacionesController.js';

router.get('/', datosNotificaciones)
router.post('/eliminar', eliminarNotificacion);
router.post('/leido', cambiarNotificacionALeido);
router.post('/leidoTodas', cambiarTodasLasNotificacionesALeido);
router.get('/eliminarTodas', eliminarTodasLasNotificaciones);

export default router;