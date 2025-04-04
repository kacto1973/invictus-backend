import conectarDB from "../config/db.js";
import Gabinete from "../models/reactivos/Gabinete.js";

const seedGabinetes = async () => {
    try {
        await conectarDB();
        await Gabinete.deleteMany(); // Limpiar la colección

        // Datos de ejemplo
        const gabinetes = [
            { nombre: "Gabinete 1", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 2", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 3", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 4", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 5", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 6", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 7", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 8", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Gabinete 9", descripcion: "Ubicado en el laboratorio" },
            { nombre: "Cubiculo Dra. Mayra", descripcion: "Ubicado en la oficina de la Dra. Mayra" },
            { nombre: "Cubiculo Dr. Martin", descripcion: "Ubicado en la oficina del Dr. Martin" },
        ];

        await Gabinete.insertMany(gabinetes); // Insertar los datos de ejemplo
        console.log("Gabinetes sembrados exitosamente");
    } catch (error) {
        console.error("Error al sembrar los gabinetes:", error);
        throw error;
    }
}

export default seedGabinetes;