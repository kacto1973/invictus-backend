import Notificacion from "../models/notificaciones/Notificacion.js";
import observarAgotados from "../middleware/notificaciones/detectarReactivosAgotados.js"
import observarNuevasCalendarizaciones from "../middleware/notificaciones/detectarEquipoCalendarizado.js"
import conseguirIDEstadoNotificacion from "../middleware/notificaciones/ConseguirIDs/conseguirIDEstadoNotificacion.js";
import observarMantenimientos from "../middleware/notificaciones/detectarEquipoMatenimientoActual.js";

// Aqui se activa el MiddleWare
observarAgotados();
observarNuevasCalendarizaciones();
observarMantenimientos();

const datosNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.find()
            .populate("idTipoNotificacion", "nombre")
            .populate("idEstadoNotificacion", "nombre")
            .populate("idReactivo", "nombre")
            .populate("idEquipo", "nombre");

        res.status(200).json(notificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
};

const eliminarNotificacion = async (req, res) => {
    /**
        Se eliminan las notificaciones que tengan el estado de eliminado
        y se cambia el estado a eliminado si no lo tienen.
     @param {String} req.params.id - ID de la notificacion a eliminar.
     @returns {JSON} - Mensaje de exito o error.
    */
    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();
    try {
        let valor = await Notificacion.findById(req.params.id);
        if (valor.idEstadoNotificacion.equals(listaEstadoNotificacion[2])) {
            await Notificacion.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: `Notificación ${valor.idEstadoNotificacion} eliminada completamente.` });
        } else {
            await Notificacion.findByIdAndUpdate(req.params.id, {idEstadoNotificacion: listaEstadoNotificacion[2]});
            res.status(200).json({ message: `Notificación ${valor.idEstadoNotificacion} eliminada.` });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

const cambiarNotificacionALeido = async (req, res) => {
    /**
        Cambia el estado de la notificacion a leido.
        @param {String} req.params.id - ID de la notificacion a cambiar.
        @returns {JSON} - Mensaje de exito o error.
    */
    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();
    try {
        await Notificacion.findByIdAndUpdate(
            req.params.id,
            {idEstadoNotificacion: listaEstadoNotificacion[0]}
        );
        res.status(200).json({ message: "Notificación leída" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

const cambiarTodasLasNotificacionesALeido = async (req, res) => {
    /**
        Cambia el estado de todas las notificaciones a leido.
        @returns {JSON} - Mensaje de exito o error.
    */
    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();
    try {
        await Notificacion.updateMany(
            {idEstadoNotificacion: listaEstadoNotificacion[1]},
            {idEstadoNotificacion: listaEstadoNotificacion[0]}
        );
        res.status(200).json({ message: "Todas las notificaciones fueron leídas" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

export {
    datosNotificaciones,
    eliminarNotificacion,
    cambiarTodasLasNotificacionesALeido,
    cambiarNotificacionALeido
};