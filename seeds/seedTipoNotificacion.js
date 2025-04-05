import conectarDB from "../config/db.js";
import TipoNotificacion from "../models/notificaciones/TipoNotificacion.js";

const seedTipoNotificacion = async () => {
    try {
        await conectarDB();
        await TipoNotificacion.deleteMany(); // Limpiar la colección

        // Datos de ejemplo
        const tipos = [
            { nombre: "Reactivo Agotado" },
            { nombre: "Equipo Calendarizado" },
            { nombre: "Equipo en Mantenimiento" },
        ];

        await TipoNotificacion.insertMany(tipos); // Insertar los datos de ejemplo
        console.log("Tipos de notificación sembrados exitosamente");
    } catch (error) {
        console.error("Error al sembrar los tipos de notificación:", error);
        throw error;
    }
}

export default seedTipoNotificacion;