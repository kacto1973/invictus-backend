import conectarDB from "../config/db.js";
import EstadoReporte from "../models/reportes/EstadoReporte.js";

const seedEstadoReporte = async () => {
    try {
        await conectarDB();
        await EstadoReporte.deleteMany(); // Elimina todos los registros existentes

        const estadosReporte = [
            { nombre: "En proceso" },
            { nombre: "Error" },
            { nombre: "Completado" }
        ];

        await EstadoReporte.insertMany(estadosReporte); // Inserta los nuevos registros
        console.log("Tipos de reporte sembrados exitosamente.");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}

export default seedEstadoReporte;