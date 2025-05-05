import conectarDB from "../../config/db.js";
import Marca from "../../models/reactivos/Marca.js";
import Reactivo from "../../models/reactivos/Reactivo.js";
import Gabinete from "../../models/reactivos/Gabinete.js";
import UnidadMedida from "../../models/reactivos/UnidadMedida.js";
import EstadoFisico from "../../models/reactivos/EstadoFisico.js";
import Categoria from "../../models/reactivos/Categoria.js";

const seedReactivos = async () => {
    try {
        await conectarDB(); // Conectar a la base de datos
        await Reactivo.deleteMany(); // Limpiar la colección

        const gabinetes = await Gabinete.find();
        const marcas = await Marca.find();
        const unidades = await UnidadMedida.find();
        const estados = await EstadoFisico.find();
        const categorias = await Categoria.find();

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
                // categoria: "Ácidos y Bases",
                // marca: "SIGMA",
                unidad: "l",
                estado: "Líquido",
                // codigoCatalogo: "AC-001"
            },
            {
                nombre: "Etanol",
                esPeligroso: true,
                cantidad: 1000,
                gabinete: "Gabinete 2",
                categoria: "Solventes",
                marca: "Bio-Rad",
                unidad: "ml",
                estado: "Líquido",
                codigoCatalogo: "SC-002"
            },
            {
                nombre: "Sulfato de Cobre",
                esPeligroso: false,
                cantidad: 200,
                gabinete: "Gabinete 3",
                categoria: "Sales Inorgánicas",
                marca: "GOLDEN BELL",
                unidad: "kg",
                estado: "Sólido",
                codigoCatalogo: "HS-003"
            },
            {
                nombre: "Nitrato de Plata",
                esPeligroso: true,
                cantidad: 150,
                gabinete: "Gabinete 4",
                categoria: "Sales Inorgánicas",
                marca: "J.T. Baker",
                unidad: "g",
                estado: "Sólido",
                codigoCatalogo: "NP-004"
            },
            {
                nombre: "Fosfato de Calcio",
                esPeligroso: false,
                cantidad: 300,
                gabinete: "Gabinete 5",
                categoria: "Sales Inorgánicas",
                marca: "VETEC",
                unidad: "mg",
                estado: "Sólido",
                codigoCatalogo: "CS-005"
            },
            {
                nombre: "Acetona",
                esPeligroso: true,
                cantidad: 750,
                gabinete: "Gabinete 6",
                categoria: "Solventes",
                marca: "FAGA LAB",
                unidad: "ml",
                estado: "Líquido",
                codigoCatalogo: "AC-001"
            },
            {
                nombre: "Cloruro de Sodio",
                esPeligroso: false,
                cantidad: 1000,
                gabinete: "Gabinete 7",
                categoria: "Sales Inorgánicas",
                marca: "NutriCology",
                unidad: "g",
                estado: "Sólido",
                codigoCatalogo: "AC-001"
            },
            {
                nombre: "Solución Salina",
                esPeligroso: false,
                cantidad: 1200,
                gabinete: "Gabinete 8",
                categoria: "Reactivos Químicos",
                marca: "PIERCE",
                unidad: "ml",
                estado: "Líquido",
                codigoCatalogo: "AC-001"
            },
            {
                nombre: "Agar",
                esPeligroso: false,
                cantidad: 50,
                gabinete: "Gabinete 9",
                categoria: "Medios de Cultivo",
                marca: "Molecular Bioproducts",
                unidad: "kg",
                estado: "Sólido",
                codigoCatalogo: "AC-001"
            },
            {
                nombre: "Bicarbonato de Sodio",
                esPeligroso: false,
                cantidad: 0,
                gabinete: "Cubiculo Dra. Mayra",
                categoria: "Sales Inorgánicas",
                marca: "ALDRICH",
                unidad: "mg",
                estado: "Sólido",
                codigoCatalogo: "AC-001"
            }
        ];

        let i = 0;
        const valores = [120, 1000, 100, 500, 700, 800, 5000, 100, 2000, 1000]
        for (const item of reactivos) {
            const nuevoReactivo = new Reactivo({
                nombre: item.nombre,
                esPeligroso: item.esPeligroso,
                cantidad: item.cantidad,
                codigoCatalogo: item.codigoCatalogo ?? null,
                idGabinete: getIdByName(gabinetes, item.gabinete),
                idCategoria: getIdByName(categorias, item.categoria),
                idMarca: getIdByName(marcas, item.marca),
                unidadMedida: {
                    valor: valores[i],
                    idUnidadMedida: getIdByName(unidades, item.unidad)
                },
                idEstadoFisico: getIdByName(estados, item.estado),
                status: true
            });
            i += 1;
            await nuevoReactivo.save();
            console.log(`Reactivo "${item.nombre}" guardado.`);
        }

    } catch (error) {
        console.error("Error al sembrar la base de datos:", error.message);
        throw error;
    }
}

export default seedReactivos;
