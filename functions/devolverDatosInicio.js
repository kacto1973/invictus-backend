const {
    reactivos, gabinetes, marcas, unidadesMedidas, estadosFisicos, reactivosDefectuosos,
    movimientosReactivos, tiposMovimientos, reportes, tiposReportes, notificaciones,
    tiposNotificaciones, equipos, reservas, mantenimientos, motivos
} = require('./database/schemas');

async function devolverDatosInicio() {
    const TotalReactivos = await reactivos.aggregate([
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

    const TotalReactivosAgotados = await reactivos.aggregate([
        {
            $match: { cantidad: 0 }
        },
        {
            $match: { status: true }
        },
        {
            $count: "totalCantidad"
        }
    ]);

    const TotalReactivosAdquiridos = await movimientosReactivos.aggregate([
        {
            $lookup: {
                from: "tipomovimientos", // Nombre correcto de la colección
                localField: "idTipoMovimiento",
                foreignField: "_id",
                as: "tipoMovimiento"
            }
        },
        { $unwind: "$tipoMovimiento" },
        {
            $match: {
                "tipoMovimiento.nombre": "entrada"
            }
        },
        {
            $group: {
                _id: null,
                totalCantidad: { $sum: "$cantidad" }
            }
        }
    ]);

    const datosGraficaUnidadMedida = await reactivos.aggregate([
        {
            $lookup: {
                from: "unidadmedidas", // Nombre correcto de la colección
                localField: "idUnidadMedida",
                foreignField: "_id",
                as: "idUnidadMedida"
            }
        },
        { $unwind: "$idUnidadMedida" },
        {
            $group: {
                _id: "$idUnidadMedida.nombre", // Campo corregido
                totalCantidad: { $sum: "$cantidad" }
            }
        }
    ]);

    const datosGraficaEstadoFisico = await reactivos.aggregate([
        {
            $lookup: {
                from: "estadofisicos", // Nombre correcto de la colección
                localField: "estadoFisico",
                foreignField: "_id",
                as: "estadoFisico"
            }
        },
        { $unwind: "$estadoFisico" },
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

module.exports = { devolverDatosInicio };
