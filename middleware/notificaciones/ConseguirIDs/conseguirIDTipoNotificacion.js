import TipoNotificacion from "../../../models/notificaciones/TipoNotificacion.js";

let cachedTipoNotificacion = null;

const conseguirIDTipoNotificacion = async () => {
    if (cachedTipoNotificacion) {
        return cachedTipoNotificacion;
    }

    const [reactivoAgotado, equipoCalendarizado, equipoMantenimiento] = await Promise.all([
        TipoNotificacion.findOne({ nombre: "Reactivo Agotado" }),
        TipoNotificacion.findOne({ nombre: "Equipo Calendarizado" }),
        TipoNotificacion.findOne({ nombre: "Equipo en Mantenimiento" })
    ]);

    if (!reactivoAgotado || !equipoCalendarizado || !equipoMantenimiento) {
        throw new Error("Uno o más tipos de notificación no existen en la base de datos");
    }

    cachedTipoNotificacion = [
        reactivoAgotado._id,
        equipoCalendarizado._id,
        equipoMantenimiento._id
    ];
    return cachedTipoNotificacion;
};

export default conseguirIDTipoNotificacion;
