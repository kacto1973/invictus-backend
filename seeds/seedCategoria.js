import conectarDB from "../config/db.js";
import Categoria from "../models/reactivos/Categoria.js";

const seedCategoria = async () => {
    try {
        await conectarDB();
        await Categoria.deleteMany(); // Limpiar la colección

        const categoria = [
            { nombre: "Ácidos" },
            { nombre: "Bases" },
            { nombre: "Sales" },
            { nombre: "Disolventes" },
            { nombre: "Reactivos Orgánicos" },
            { nombre: "Reactivos Inorgánicos" },
        ];

        await Categoria.insertMany(categoria); // Insertar los datos de ejemplo
        console.log("Categorías sembradas exitosamente");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}

export default seedCategoria;