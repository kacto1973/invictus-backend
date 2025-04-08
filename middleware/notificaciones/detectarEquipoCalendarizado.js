import Notificacion from "../../models/notificaciones/Notificacion.js";
import Reserva from "../../models/equipo/Reserva.js";
import conseguirIDTipoNotificacion from "./ConseguirIDs/conseguirIDTipoNotificacion.js";
import conseguirIDEstadoNotificacion from "./ConseguirIDs/conseguirIDEstadoNotificacion.js";
import Equipo from "../../models/equipo/Equipo.js";

const observarNuevasCalendarizaciones = async () => {
    const pipeline = [{ $match: { operationType: 'insert' } }];
    const reservaStream = Reserva.watch(pipeline);
    const listaTipoNotificacion = await conseguirIDTipoNotificacion();
    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();

    reservaStream.on('change', async (change) => {
        try {
            const nuevaReserva = change.fullDocument;
            const equipo = await Equipo.findById(nuevaReserva.idEquipo);

            const now = new Date();
            now.setHours(now.getHours() - 7);

            let tiempo = new Date(nuevaReserva.fechaFin).getTime() - new Date(nuevaReserva.fechaInicio).getTime();
            let dias = Math.floor(tiempo / (1000 * 3600 * 24));

            await Notificacion.create({
                idTipoNotificacion: listaTipoNotificacion[1],
                idEstadoNotificacion: listaEstadoNotificacion[1],
                idEquipo: nuevaReserva.idEquipo,
                descripcion: `El ${equipo.nombre} ha sido calendarizado por ${dias} dias`,
                fechaGeneracion: now,
                status: true
            });
            console.log(`Se acaba de calendarizar el equipo ${equipo.nombre}`);
        } catch (error) {
            console.error("Error al crear la notificación de calendarizacion:", error);
        }
    });
};

export default observarNuevasCalendarizaciones;