import conectarDB from "../config/db.js";
import TipoReporte from "../models/reportes/TipoReporte.js";

const seedTipoReporte = async () => {
    try {
        await conectarDB();
        await TipoReporte.deleteMany(); // Elimina todos los registros existentes

        const tiposReporte = [
            { nombre: "Reactivos" },
            { nombre: "Equipos" }
        ];

        await TipoReporte.insertMany(tiposReporte); // Inserta los nuevos registros
        console.log("Tipos de reporte sembrados exitosamente.");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}

export default seedTipoReporte;