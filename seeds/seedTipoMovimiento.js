import conectarDB from '../config/db.js';
import TipoMovimiento from '../models/movimientos/TipoMovimiento.js';

const seedTipoMovimiento = async () => {
    try {
        await conectarDB();
        await TipoMovimiento.deleteMany(); // Limpiar la colección antes de sembrar datos 

        // Definir los tipos de movimiento
        const tiposMovimiento = [
            { nombre: "Entrada" },
            { nombre: "Salida" }
        ];

        await TipoMovimiento.insertMany(tiposMovimiento); // Insertar los tipos de movimiento en la base de datos
        console.log("Tipos de movimiento creados exitosamente.");
    } catch (error) {
        console.error("Error al crear los tipos de movimiento:", error);
        throw error;
    }
}

export default seedTipoMovimiento;