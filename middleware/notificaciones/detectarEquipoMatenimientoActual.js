import conseguirIDTipoNotificacion from "./ConseguirIDs/conseguirIDTipoNotificacion.js";
import conseguirIDEstadoNotificacion from "./ConseguirIDs/conseguirIDEstadoNotificacion.js";
import Mantenimiento from "../../models/equipo/Mantenimiento.js";
import Notificacion from "../../models/notificaciones/Notificacion.js";
import equipo from "../../models/equipo/Equipo.js";
import cron from "node-cron";

const observarMantenimientos = () => {
    return cron.schedule('* * * * *', async () => {
        try {   // Esta establecido en actualizaciones de 1 minuto para pruebas, se cambiara a 1 hora
            const now = new Date();
            now.setHours(now.getHours() - 7);
            console.log(`La hora actual es: ${now}\nEn UTC es: ${new Date()}`); // La hora sale mal pero parece que funciona
            // console.log("Observando si hay mantenimientos actualmente...");

            const mantenimientosActivos = await Mantenimiento.find({
                fechaInicio: {$lte: now},
                fechaFin: {$gte: now}
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
                        descripcion: `El equipo con ID ${documentoEquipo.nombre} está en mantenimiento.`,
                        fechaGeneracion: new Date(),
                        status: true
                    });

                    console.log(`Notificación creada para el equipo ${documentoEquipo.nombre}`);
                }
            }

            const notificacionesActivas = await Notificacion.find({
                status: true,
                idEquipo: {$exists: true},
                idTipoNotificacion: listaIDTipo[2], // Mantenimiento
            });

            for (let notificacion of notificacionesActivas) {
                const mantenimiento = await Mantenimiento.findOne({
                    idEquipo: notificacion.idEquipo
                });

                if (mantenimiento && mantenimiento.fechaFin < now) {
                    await Notificacion.updateOne({_id: notificacion._id}, {status: false});
                    console.log(`Notificación del equipo ${notificacion.idEquipo} se le cambio el status a false.`);
                }
            }
        } catch (error) {
            console.error("Error al observar mantenimientos:", error);
        }
    });
}

export default observarMantenimientos;