import conectarDB from "../../config/db.js";
import Categoria from "../../models/reactivos/Categoria.js";

const seedCategorias = async () => {
    try {
        await conectarDB();
        await Categoria.deleteMany(); // Limpia la colección

        const categorias = [
            { nombre: "Reactivos Químicos" },
            { nombre: "Solventes" },
            { nombre: "Indicadores" },
            { nombre: "Sales Inorgánicas" },
            { nombre: "Ácidos y Bases" },
            { nombre: "Medios de Cultivo" },
            { nombre: "Reactivos Biológicos" },
            { nombre: "Colorantes" }
        ];

        await Categoria.insertMany(categorias);
        console.log("Categorías sembradas exitosamente");
    } catch (error) {
        console.error("Error al sembrar categorías:", error);
        process.exit(1);
    }
}

export default seedCategorias;
