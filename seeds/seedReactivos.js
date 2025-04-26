import conectarDB from "../config/db.js";
import Reactivo from "../models/reactivos/Reactivo.js";

const seedReactivos = async () => {
    try {
        await conectarDB();
        await Reactivo.deleteMany(); // Limpiar la colección

        const reactivos = [
            {                
                idGabinete: "643b0f1e1c4d88a1b8f0a001",
                idMarca: "643b0f1e1c4d88a1b8f0a002",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00e",
                codigoCatalogo: "AC-001",
                nombre: "Ácido Clorhídrico",
                esPeligroso: true,
                cantidad: 100,
                unidadMedida: {
                    valor: 100,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a003"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a001",
                idMarca: "643b0f1e1c4d88a1b8f0a002",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00e",
                codigoCatalogo: "SC-002",
                nombre: "Sulfato de Cobre",
                esPeligroso: false,
                cantidad: 50,
                unidadMedida: {
                    valor: 50,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a003"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a005",
                idMarca: "643b0f1e1c4d88a1b8f0a006",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00f",
                codigoCatalogo: "HS-003",
                nombre: "Hidróxido de Sodio",
                esPeligroso: true,
                cantidad: 200,
                unidadMedida: {
                    valor: 200,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a007"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a005",
                idMarca: "643b0f1e1c4d88a1b8f0a006",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00f",
                codigoCatalogo: "NP-004",
                nombre: "Nitrato de Plata",
                esPeligroso: true,
                cantidad: 10,
                unidadMedida: {
                    valor: 10,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a007"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a009",
                idMarca: "643b0f1e1c4d88a1b8f0a00a",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00e",
                codigoCatalogo: "CS-005",
                nombre: "Cloruro de Sodio",
                esPeligroso: false,
                cantidad: 300,
                unidadMedida: {
                    valor: 300,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a00b"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a009",
                idMarca: "643b0f1e1c4d88a1b8f0a00a",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00e",
                codigoCatalogo: "PP-006",
                nombre: "Permanganato de Potasio",
                esPeligroso: true,
                cantidad: 150,
                unidadMedida: {
                    valor: 150,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a00b"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a009",
                idMarca: "643b0f1e1c4d88a1b8f0a00a",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00f",
                codigoCatalogo: "AN-007",
                nombre: "Ácido Nítrico",
                esPeligroso: true,
                cantidad: 75,
                unidadMedida: {
                    valor: 75,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a00b"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a009",
                idMarca: "643b0f1e1c4d88a1b8f0a00a",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00e",
                codigoCatalogo: "CC-008",
                nombre: "Carbonato de Calcio",
                esPeligroso: false,
                cantidad: 500,
                unidadMedida: {
                    valor: 500,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a00b"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a009",
                idMarca: "643b0f1e1c4d88a1b8f0a00a",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00e",
                codigoCatalogo: "FP-009",
                nombre: "Fosfato de Potasio",
                esPeligroso: false,
                cantidad: 250,
                unidadMedida: {
                    valor: 250,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a00b"
                },
                status: true
            },
            {
                idGabinete: "643b0f1e1c4d88a1b8f0a009",
                idMarca: "643b0f1e1c4d88a1b8f0a00a",
                idCategoria: "643b0f1e1c4d88a1b8f0a00d",
                idEstadoFisico: "643b0f1e1c4d88a1b8f0a00f",
                codigoCatalogo: "AA-010",
                nombre: "Ácido Acético",
                esPeligroso: true,
                cantidad: 120,
                unidadMedida: {
                    valor: 120,
                    idUnidadMedida: "643b0f1e1c4d88a1b8f0a00b"
                },
                status: true
            }
        ];

        await Reactivo.insertMany(reactivos); // Insertar los datos de ejemplo
        console.log("Reactivos sembrados exitosamente");        
    } catch (error) {
        console.error("Error al sembrar los reactivos:", error);
        throw error;
    }
}

export default seedReactivos;