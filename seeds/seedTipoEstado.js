import conectarDB from "../config/db.js";
import TipoEstado from "../models/control/TipoEstado.js";

const seedTipoEstado = async () => {
    try {
        await conectarDB();
        await TipoEstado.deleteMany(); // Elimina todos los registros existentes

        const tiposEstado = [
            { nombre: "Aprobado" },
            { nombre: "Defectuoso" },
            { nombre: "Desechado"}
        ];

        await TipoEstado.insertMany(tiposEstado); // Inserta los nuevos registros
        console.log("Tipos de estado sembrados exitosamente.");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}

export default seedTipoEstado;