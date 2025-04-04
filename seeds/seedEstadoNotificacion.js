import conectarDB from "../config/db.js";
import EstadoNotificacion from "../models/notificaciones/EstadoNotificacion.js";

const seedEstadoNotificacion = async () => {
    try {
        await conectarDB();
        await EstadoNotificacion.deleteMany(); // Limpiar la colección

        // Datos de ejemplo
        const estados = [
            { nombre: "Leido" },
            { nombre: "Sin leer" },
            { nombre: "Eliminado" },
        ];

        await EstadoNotificacion.insertMany(estados); // Insertar los datos de ejemplo
        console.log("Estados de notificación sembrados exitosamente");
    } catch (error) {
        console.error("Error al sembrar los estados de notificación:", error);
        throw error;
    }
}

export default seedEstadoNotificacion;