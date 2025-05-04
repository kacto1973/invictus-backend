import cron from "node-cron";
import Equipo from "../../models/equipo/Equipo.js";
import Reserva from "../../models/equipo/Reserva.js";
import Mantenimiento from "../../models/equipo/Mantenimiento.js";

/**
 * Verifica y actualiza el estado de cada equipo:
 * - Si el equipo tiene un mantenimiento activo hoy, cambia su estado a "En mantenimiento"
 * - Si el equipo tiene una reserva activa hoy, cambia su estado a "En reserva"
 * - Si el equipo no tiene ni mantenimiento ni reserva hoy, cambia su estado a "Liberado"
 *
 * @async
 * @function verificarEstadoEquipos
 * @returns {Promise<void>} solo actualiza los equipos en la base de datos
 */
const verificarEstadoEquipos = async () => {
  const hoy = new Date(new Date().setUTCHours(0, 0, 0, 0));

  try {
    // obtener todos los equipos
    const equipos = await Equipo.find({ status: { $ne: "Eliminado" } });

    for (const equipo of equipos) {
      // verificar mantenimientos
      const mantenimientoActivo = await Mantenimiento.findOne({
        idEquipo: equipo._id,
        status: true,
        fechaInicio: { $lte: hoy },
        fechaFin: { $gte: hoy },
      });
      if (mantenimientoActivo && equipo.status !== "En mantenimiento") {
        await Equipo.findByIdAndUpdate(equipo._id, {
          status: "En mantenimiento",
        });
        console.log(`Inició el mantenimiento del equipo con id ${equipo._id}`);
        continue;
      }

      // verificar reservas
      const reservaActiva = await Reserva.findOne({
        idEquipo: equipo._id,
        status: true,
        fechaInicio: { $lte: hoy },
        fechaFin: { $gte: hoy },
      });
      if (reservaActiva && equipo.status !== "En reserva") {
        await Equipo.findByIdAndUpdate(equipo._id, { status: "En reserva" });
        console.log(`Inició la reserva del equipo con id ${equipo._id}`);
        continue;
      }

      if (
        !reservaActiva &&
        !mantenimientoActivo &&
        equipo.status !== "Liberado"
      ) {
        await Equipo.findByIdAndUpdate(equipo._id, { status: "Liberado" });
        console.log(`Equipo con id ${equipo._id} liberado automáticamente`);
      }
    }
  } catch (error) {
    console.error("Error al verificar y actualizar equipos:", error);
  }
};

/**
 * Tarea cron programada para ejecutar la función verificarEstadoEquipos diariamente en media noche
 *
 * @see verificarEstadoEquipos
 */
cron.schedule("0 0 * * *", () => {
  console.log("Ejecutando verificación de estado de los equipos 👍");
  verificarEstadoEquipos();
});
