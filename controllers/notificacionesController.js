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
     @param {String} req.body.id - ID de la notificacion a eliminar.
     @returns {JSON} - Mensaje de exito o error.
    */

    if (!req.body.id) {
        res.status(400).json({ error: "ID de notificación no proporcionado" });
        return;
    }

    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();

    try {
        let valor = await Notificacion.findById(req.body.id);

        if (!valor) {
            res.status(404).json({ error: "Notificación no encontrada" });
            return;
        }

        if (valor.idEstadoNotificacion.equals(listaEstadoNotificacion[2])) {
            await Notificacion.findByIdAndDelete(req.body.id);
            res.status(200).json({ message: `Notificación ${valor.idEstadoNotificacion} eliminada completamente.` });
        } else {
            await Notificacion.findByIdAndUpdate(req.body.id, {idEstadoNotificacion: listaEstadoNotificacion[2]});
            res.status(200).json({ message: `Notificación ${valor.idEstadoNotificacion} se ha cambiado a false.` });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

const eliminarTodasLasNotificaciones = async (req, res) => {
    /**
     Se eliminan todas las notificaciones actuales. Esto no va ser final, falta implementar la papelera.
     @returns {JSON} - Mensaje de exito o error.
     */
    try {
        // const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();
        // const notificaciones = await Notificacion.find();

        // Cuando se implemente la papelera
        // notificaciones.forEach(notificacion => {
        //     if (notificacion.idEstadoNotificacion.equals(listaEstadoNotificacion[2])) {
        //         await Notificacion.findByIdAndDelete(notificacion._id);
        //     } else {
        //         await Notificacion.findByIdAndUpdate(notificacion._id, {idEstadoNotificacion: listaEstadoNotificacion[2]});
        //     }
        // });

        // Por mientras eliminado todo
        await Notificacion.deleteMany({});

        res.status(200).json({ message: 'Se ha aplicado el cambio a todas las notificaciones.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar las notificaciones" });
    }
}

const cambiarNotificacionALeido = async (req, res) => {
    /**
        Cambia el estado de la notificacion a leido.
        @param {String} req.body.id - ID de la notificacion a cambiar.
        @returns {JSON} - Mensaje de exito o error.
    */

    if (!req.body.id) {
        res.status(400).json({ error: "ID de notificación no proporcionado" });
        return;
    }

    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();

    try {
        const notificacion = await Notificacion.findByIdAndUpdate(
            req.body.id,
            {idEstadoNotificacion: listaEstadoNotificacion[0]}
        );

        if (!notificacion) {
            res.status(404).json({ error: "Notificación no encontrada" });
            return;
        }

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
        res.status(200).json({ message: "Todas las notificaciones fueron leídas." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las notificaciones." });
    }
}

export {
    datosNotificaciones,
    eliminarNotificacion,
    cambiarTodasLasNotificacionesALeido,
    cambiarNotificacionALeido,
    eliminarTodasLasNotificaciones
};