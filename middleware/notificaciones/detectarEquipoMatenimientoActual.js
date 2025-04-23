import conseguirIDTipoNotificacion from "./ConseguirIDs/conseguirIDTipoNotificacion.js";
import conseguirIDEstadoNotificacion from "./ConseguirIDs/conseguirIDEstadoNotificacion.js";
import Mantenimiento from "../../models/equipo/Mantenimiento.js";
import Notificacion from "../../models/notificaciones/Notificacion.js";
import equipo from "../../models/equipo/Equipo.js";
import cron from "node-cron";

const observarMantenimientos = () => {
    return cron.schedule('0 * * * *', async () => { // Cada hora
        try {
            const now = new Date(new Date().setUTCHours(0, 0, 0, 0));
            console.log(`Revisando notificaciones...`);
            // console.log(`Hora actual: ${now}`);

            const mantenimientosActivos = await Mantenimiento.find({
                fechaInicio: {$lte: now},
                fechaFin: {$gte: now},
                status: true
            });

            const listaIDTipo = await conseguirIDTipoNotificacion();
            const listaIDEstado = await conseguirIDEstadoNotificacion();

            for (let mantenimiento of mantenimientosActivos) {
                const existeNotificacion = await Notificacion.findOne({
                    idEquipo: mantenimiento.idEquipo,
                    idTipoNotificacion: listaIDTipo[2], // Mantenimiento
                    status: true
                });

                if (!existeNotificacion) {
                    const documentoEquipo = await equipo.findById(mantenimiento.idEquipo);
                    await Notificacion.create({
                        idTipoNotificacion: listaIDTipo[2], // Mantenimiento
                        idEstadoNotificacion: listaIDEstado[1], // Sin leer
                        idEquipo: mantenimiento.idEquipo,
                        idMantenimiento: mantenimiento._id,
                        descripcion: `El equipo <strong>${documentoEquipo.nombre}</strong> se encuentra bajo mantenimiento.`,
                        fechaGeneracion: now,
                        status: true
                    });

                    console.log(`Notificación creada para el equipo ${documentoEquipo.nombre}`);
                }
            }

            const notificacionesActivas = await Notificacion.find({
                status: true,
                idMantenimiento: {$exists: true},
            });

            for (let notificacion of notificacionesActivas) {
                const mantenimiento = await Mantenimiento.findById(notificacion.idMantenimiento);

                if (mantenimiento && mantenimiento.fechaFin < now) {
                    await Notificacion.findByIdAndDelete(notificacion._id);
                    await Mantenimiento.findByIdAndUpdate(mantenimiento._id, {status: false});
                    console.log(`La notificación del equipo ${notificacion.idEquipo} se elimino.\nTambien se cambio a 'false' su mantenimiento unido con ID de ${mantenimiento._id}.`);
                }
            }

            console.log("Revisión de notificaciones completada.");
        } catch (error) {
            console.error("Error al observar mantenimientos:", error);
        }
    });
}

export default observarMantenimientos;