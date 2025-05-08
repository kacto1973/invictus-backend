import conectarDB from "../config/db.js";
import EstadoFisico from "../models/reactivos/EstadoFisico.js";

const seedEstadoFisico = async () => {
    try {
        await conectarDB();
        await EstadoFisico.deleteMany(); // Limpiar la colección antes de sembrar datos 

        // Definir los estados físicos
        const estadosFisicos = [
            { nombre: "Sólido" },
            { nombre: "Líquido" }            
        ];

        await EstadoFisico.insertMany(estadosFisicos);
        console.log("Estados físicos creados exitosamente.");
    } catch (error) {
        console.error("Error al crear los estados físicos:", error);
        throw error;
    }
}

export default seedEstadoFisico;