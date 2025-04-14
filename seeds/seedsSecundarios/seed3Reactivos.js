import conectarDB from "../../config/db.js";
import Marca from "../../models/reactivos/Marca.js";
import Reactivo from "../../models/reactivos/Reactivo.js";
import Gabinete from "../../models/reactivos/Gabinete.js";
import UnidadMedida from "../../models/reactivos/UnidadMedida.js";
import EstadoFisico from "../../models/reactivos/EstadoFisico.js";

const seedReactivos = async () => {
    try {
        await conectarDB(); // Conectar a la base de datos
        await Reactivo.deleteMany(); // Limpiar la colección

        const gabinetes = await Gabinete.find();
        const marcas = await Marca.find();
        const unidades = await UnidadMedida.find();
        const estados = await EstadoFisico.find();

        const getIdByName = (array, nombre) => {
            const obj = array.find(item => item.nombre === nombre);
            return obj ? obj._id : null;
        };

        const reactivos = [
            {
                nombre: "Ácido Clorhídrico",
                esPeligroso: true,
                cantidad: 500,
                gabinete: "Gabinete 1",
                marca: "SIGMA",
                unidad: "l",
                estado: "Liquido"
            },
            {
                nombre: "Etanol",
                esPeligroso: true,
                cantidad: 1000,
                gabinete: "Gabinete 2",
                marca: "Bio-Rad",
                unidad: "ml",
                estado: "Liquido"
            },
            {
                nombre: "Sulfato de Cobre",
                esPeligroso: false,
                cantidad: 200,
                gabinete: "Gabinete 3",
                marca: "GOLDEN BELL",
                unidad: "kg",
                estado: "Solido"
            },
            {
                nombre: "Nitrato de Plata",
                esPeligroso: true,
                cantidad: 150,
                gabinete: "Gabinete 4",
                marca: "J.T. Baker",
                unidad: "g",
                estado: "Solido"
            },
            {
                nombre: "Fosfato de Calcio",
                esPeligroso: false,
                cantidad: 300,
                gabinete: "Gabinete 5",
                marca: "VETEC",
                unidad: "mg",
                estado: "Solido"
            },
            {
                nombre: "Acetona",
                esPeligroso: true,
                cantidad: 750,
                gabinete: "Gabinete 6",
                marca: "FAGA LAB",
                unidad: "ml",
                estado: "Liquido"
            },
            {
                nombre: "Cloruro de Sodio",
                esPeligroso: false,
                cantidad: 1000,
                gabinete: "Gabinete 7",
                marca: "NutriCology",
                unidad: "g",
                estado: "Solido"
            },
            {
                nombre: "Solución Salina",
                esPeligroso: false,
                cantidad: 1200,
                gabinete: "Gabinete 8",
                marca: "PIERCE",
                unidad: "ml",
                estado: "Liquido"
            },
            {
                nombre: "Agar",
                esPeligroso: false,
                cantidad: 50,
                gabinete: "Gabinete 9",
                marca: "Molecular Bioproducts",
                unidad: "kg",
                estado: "Solido"
            },
            {
                nombre: "Bicarbonato de Sodio",
                esPeligroso: false,
                cantidad: 0,
                gabinete: "Cubiculo Dra. Mayra",
                marca: "ALDRICH",
                unidad: "mg",
                estado: "Solido"
            }
        ];

        for (const item of reactivos) {
            const nuevoReactivo = new Reactivo({
                nombre: item.nombre,
                esPeligroso: item.esPeligroso,
                cantidad: item.cantidad,
                idGabinete: getIdByName(gabinetes, item.gabinete),
                idMarca: getIdByName(marcas, item.marca),
                idUnidadMedida: getIdByName(unidades, item.unidad),
                estadoFisico: getIdByName(estados, item.estado),
                status: true
            });

            await nuevoReactivo.save();
            console.log(`Reactivo "${item.nombre}" guardado.`);
        }

    } catch (error) {
        console.error("Error al sembrar la base de datos:", error.message);
        throw error;
    }
}

export default seedReactivos;
