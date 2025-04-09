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
    console.log(`Eliminando notificacion ${req.params.id}`);
    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();
    try {
        let valor = await Notificacion.findById(req.params.id);
        if (valor.idEstadoNotificacion.equals(listaEstadoNotificacion[2])) {
            await Notificacion.findByIdAndUpdate(req.params.id, {status: false});
        } else {
            await Notificacion.findByIdAndUpdate(req.params.id, {idEstadoNotificacion: listaEstadoNotificacion[2]});
        }
        res.status(200).json({ message: "Notificación eliminada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

const cambiarNotificacionALeido = async (req, res) => {
    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();
    try {
        await Notificacion.findByIdAndUpdate( req.params.id,
            {idEstadoNotificacion: listaEstadoNotificacion[0]}
        ); // Cambia a Leido
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

export {
    datosNotificaciones,
    eliminarNotificacion,
    cambiarNotificacionALeido
};