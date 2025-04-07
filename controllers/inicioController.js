import Reactivo from '../models/reactivos/Reactivo.js';
import MovimientoReactivo from '../models/movimientos/MovimientoReactivo.js';

async function datosInicio() {
    const TotalReactivos = await Reactivo.aggregate([
        {
            $match: { status: true }
        },
        {
            $group: {
                _id: null,
                totalCantidad: { $sum: "$cantidad" }
            }
        }
    ]);

    const TotalReactivosAgotados = await Reactivo.aggregate([
        {
            $match: {
                cantidad: 0,
                status: true
            }
        },
        {
            $count: "totalCantidad"
        }
    ]);

    const TotalReactivosAdquiridos = await MovimientoReactivo.aggregate([
        {
            $lookup: {
                from: "tipomovimientos",
                localField: "idTipoMovimiento",
                foreignField: "_id",
                as: "tipoMovimiento"
            }
        },
        { $unwind: "$tipoMovimiento" },
        {
            $match: {
                "tipoMovimiento.nombre": "Entrada"
            }
        },
        {
            $group: {
                _id: null,
                totalCantidad: { $sum: "$cantidad" }
            }
        }
    ]);

    const datosGraficaUnidadMedida = await Reactivo.aggregate([
        {
            $lookup: {
                from: "unidadmedidas",
                localField: "idUnidadMedida",
                foreignField: "_id",
                as: "idUnidadMedida"
            }
        },
        { $unwind: "$idUnidadMedida" },
        { $match: { status: true } },
        {
            $group: {
                _id: "$idUnidadMedida.nombre", // Campo corregido
                totalCantidad: { $sum: "$cantidad" }
            }
        }
    ]);

    const datosGraficaEstadoFisico = await Reactivo.aggregate([
        {
            $lookup: {
                from: "estadofisicos", // Nombre correcto de la colección
                localField: "estadoFisico",
                foreignField: "_id",
                as: "estadoFisico"
            }
        },
        { $unwind: "$estadoFisico" },
        { $match: { status: true } },
        {
            $group: {
                _id: "$estadoFisico.nombre",
                totalCantidad: { $sum: "$cantidad" }
            }
        }
    ]);

    return {
        TotalReactivos: TotalReactivos[0]?.totalCantidad ?? 0,
        TotalReactivosAgotados: TotalReactivosAgotados[0]?.totalCantidad ?? 0,
        TotalReactivosAdquiridos: TotalReactivosAdquiridos[0]?.totalCantidad ?? 0,
        datosGraficaUnidadMedida,
        datosGraficaEstadoFisico
    };
}

const devolverDatosInicio = async (req, res) => {
    try {
        const datos = await datosInicio();
        res.status(200).json(datos);
    } catch (error) {
        console.error("Error al obtener los datos de inicio:", error);
        res.status(500).json({ error: 'Error al obtener los datos de inicio' });
    }
}

export { devolverDatosInicio };