import EstadoNotificacion from "../../../models/notificaciones/EstadoNotificacion.js";

let cachedEstadoNotificacion = null;

const conseguirIDEstadoNotificacion = async () => {
    if (cachedEstadoNotificacion) {
        return cachedEstadoNotificacion;
    }

    const [leido, sinLeer, eliminado] = await Promise.all([
        EstadoNotificacion.findOne({ nombre: "Leido" }),
        EstadoNotificacion.findOne({ nombre: "Sin leer" }),
        EstadoNotificacion.findOne({ nombre: "Eliminado" })
    ]);

    if (!leido || !sinLeer || !eliminado) {
        throw new Error("Uno o más estados no existen en la base de datos");
    }

    cachedEstadoNotificacion = [leido._id, sinLeer._id, eliminado._id];
    return cachedEstadoNotificacion;
};

export default conseguirIDEstadoNotificacion;