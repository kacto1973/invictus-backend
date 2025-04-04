import conectarDB from '../config/db.js';
import EstadoFisico from '../models/reactivos/EstadoFisico.js';

const seedEstadoFisico = async () => {
    try {
        await conectarDB();
        await EstadoFisico.deleteMany(); // Limpiar la colección

        // Datos de ejemplo
        const estados = [
            { nombre: "Solido" },
            { nombre: "Liquido" },
        ];

        await EstadoFisico.insertMany(estados); // Insertar los datos de ejemplo
        console.log("Estados físicos sembrados exitosamente");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}

export default seedEstadoFisico;