import conectarDB from "../config/db.js";
import Marca from "../models/reactivos/Marca.js";

const seedMarca = async () => {
    try {
        await conectarDB();
        await Marca.deleteMany(); // Limpiar la colección antes de sembrar

        // Datos de ejemplo para sembrar
        const marcas = [
            { nombre: "SIGMA" },
            { nombre: "Bio-Rad" },
            { nombre: "GOLDEN BELL" },
            { nombre: "J.T. Baker" },
            { nombre: "VETEC" },
            { nombre: "FAGA LAB" },
            { nombre: "NutriCology" },
            { nombre: "PIERCE" },
            { nombre: "Molecular Bioproducts" },
            { nombre: "ALDRICH" },
            { nombre: "FLUKA" },
            { nombre: "RIEDEL-DE HAEN" },
            { nombre: "FERMONT" },
            { nombre: "PISSA-UNISON" },
            { nombre: "MERCK" },
            { nombre: "MEYER" },
            { nombre: "SAFC" },
            { nombre: "HYCEL" },
            { nombre: "FISHER" },
            { nombre: "SUMILAB" },
            { nombre: "THERMO" },
            { nombre: "CHEMICAL MFG" },
            { nombre: "YSI" },
            { nombre: "ALFA AESAR" },
            { nombre: "FASAMED" },
            { nombre: "JALMEK" },
            { nombre: "MTY" },
            { nombre: "N/D" }
        ];

        await Marca.insertMany(marcas); // Insertar los datos de ejemplo
        console.log("Marcas sembradas exitosamente");
    } catch (error) {
        console.error("Error al sembrar la base de datos:", error.message);
        throw error;
    }
}

export default seedMarca;