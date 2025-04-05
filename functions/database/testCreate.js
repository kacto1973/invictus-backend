// Este archivo es de prueba, crea datos para la base de datos para probar el sistema, luego se deben eliminar
// con el otro archivo testDelete.js

const mongoose = require('./connect');
const {
    reactivos,
    gabinetes,
    marcas,
    unidadesMedidas,
    estadosFisicos,
    reactivosDefectuosos,
    movimientosReactivos,
    tiposMovimientos,
    reportes,
    tiposReportes,
    notificaciones,
    estadoNotificaciones,
    tiposNotificaciones,
    equipos,
    reservas,
    mantenimientos,
    motivos,
} = require('./schemas');

async function insertTestData() {
    try {

        // Crear gabinetes
        const [gabineteQuimica, gabineteBiologia] = await gabinetes.create([
            {
                nombre: 'Gabinete Química',
                descripcion: 'Reactivos químicos generales',
                status: 'activo'
            },
            {
                nombre: 'Gabinete Biología',
                descripcion: 'Materiales biológicos y cultivos',
                status: 'activo'
            },
            {
                nombre: 'Gabinete Desechos',
                descripcion: 'Materiales para desecho',
                status: 'inactivo'
            }
        ]);

        // Crear marcas
        const [marcaEjemplo, marcaBioTech, marcaChemMaster] = await marcas.create([
            { nombre: 'Marca Ejemplo' },
            { nombre: 'BioTech' },
            { nombre: 'ChemMaster' }
        ]);

        // Crear unidades de medida
        const unidades = await unidadesMedidas.create([
            { nombre: 'l' },
            { nombre: 'ml' },
            { nombre: 'kg' },
            { nombre: 'g' },
            { nombre: 'mg' }
        ]);

        // Crear estados físicos
        const [estadoLiquido, estadoSolido] = await estadosFisicos.create([
            { nombre: 'liquido' },
            { nombre: 'solido' }
        ]);

        // Tipos de movimiento
        const [tipoEntrada, tipoSalida] = await tiposMovimientos.create([
            { nombre: 'entrada' },
            { nombre: 'salida' }
        ]);

        // Motivos
        const [motivoCaducado, motivoContaminado, motivoDaniado] = await motivos.create([
            { nombre: 'Caducado' },
            { nombre: 'Contaminado' },
            { nombre: 'Envase dañado' }
        ]);

        // Tipos de reporte
        const [tipoInventario, tipoUsoEquipos] = await tiposReportes.create([
            { nombre: 'Inventario mensual' },
            { nombre: 'Uso de equipos' }
        ]);

        // Tipos de notificación
        const [reactivoAgotado, equipoCalendarizado, actualmenteEnMantenimiento] = await tiposNotificaciones.create([
            { nombre: 'reactivoAgotado' },
            { nombre: 'equipoCalendarizado' },
            { nombre: 'actualmenteEnMantenimiento' },
        ]);

        // Estados de notificación
        const [leido, noLeido, eliminado] = await estadoNotificaciones.create([
            { nombre: 'leido' },
            { nombre: 'noLeido' },
            { nombre: 'eliminado' }
        ]);

        // Equipos
        const [microscopio, centrifuga, espectrometro] = await equipos.create([
            {
                nombre: 'Microscopio Electrónico',
                descripcion: 'Para observación a alta resolución',
                urlImagen: 'http://ejemplo.com/microscopio.jpg',
                requiereServicio: false,
                status: 'activo'
            },
            {
                nombre: 'Centrífuga de alta velocidad',
                descripcion: 'Modelo X-3000 con rotor refrigerado',
                urlImagen: 'http://ejemplo.com/centrifuga.jpg',
                requiereServicio: true,
                status: 'mantenimiento'
            },
            {
                nombre: 'Espectrómetro de masas',
                descripcion: 'Analizador de composición química',
                urlImagen: 'http://ejemplo.com/espectrometro.jpg',
                requiereServicio: true,
                status: 'activo'
            }
        ]);

        // Reactivos
        const [acidoClorhidrico, etanol, agarosa, acetato] = await reactivos.create([
            {
                idGabinete: gabineteQuimica._id,
                idMarca: marcaChemMaster._id,
                idUnidadMedida: unidades[1]._id, // ml
                estadoFisico: estadoLiquido._id,
                nombre: 'Ácido Clorhídrico',
                esPeligroso: true,
                cantidad: 500,
                status: 'activo',
                presentacion: 1000
            },
            {
                idGabinete: gabineteQuimica._id,
                idMarca: marcaBioTech._id,
                idUnidadMedida: unidades[0]._id, // l
                estadoFisico: estadoLiquido._id,
                nombre: 'Etanol 96%',
                esPeligroso: true,
                cantidad: 10,
                status: 'activo',
                presentacion: 2
            },
            {
                idGabinete: gabineteBiologia._id,
                idMarca: marcaEjemplo._id,
                idUnidadMedida: unidades[3]._id, // g
                estadoFisico: estadoSolido._id,
                nombre: 'Agarosa',
                esPeligroso: false,
                cantidad: 200,
                status: 'activo',
                presentacion: 500
            },
            {
                idGabinete: gabineteQuimica._id,
                idMarca: marcaChemMaster._id,
                idUnidadMedida: unidades[1]._id, // ml
                estadoFisico: estadoSolido._id,
                nombre: 'Acetato de sodio',
                esPeligroso: false,
                cantidad: 0,
                status: 'activo',
                presentacion: 1000
            }
        ]);

        // Reactivos defectuosos
        await reactivosDefectuosos.create([
            {
                idReactivo: acidoClorhidrico._id,
                idMotivo: motivoCaducado._id,
                descripcion: 'Lote 2022 caducado',
                status: 'resuelto',
                cantidad: 5
            },
            {
                idReactivo: etanol._id,
                idMotivo: motivoDaniado._id,
                descripcion: 'Envase roto',
                status: 'pendiente',
                cantidad: 2
            }
        ]);

        // Movimientos de reactivos
        await movimientosReactivos.create([
            {
                idReactivo: acidoClorhidrico._id,
                idTipoMovimiento: tipoEntrada._id,
                descripcion: 'Compra inicial',
                cantidad: 1000
            },
            {
                idReactivo: acidoClorhidrico._id,
                idTipoMovimiento: tipoSalida._id,
                descripcion: 'Uso en experimento',
                cantidad: 500
            },
            {
                idReactivo: agarosa._id,
                idTipoMovimiento: tipoEntrada._id,
                descripcion: 'Reabastecimiento',
                cantidad: 500
            }
        ]);

        // Reportes
        await reportes.create([
            {
                idTipoReporte: tipoInventario._id,
                nombre: 'Inventario Q1 2024',
                urlReporte: '/reportes/inventario-q1-2024.pdf',
                status: 'generado'
            },
            {
                idTipoReporte: tipoUsoEquipos._id,
                nombre: 'Uso de equipos Marzo',
                urlReporte: '/reportes/uso-equipos-marzo.pdf',
                status: 'pendiente'
            }
        ]);

        // Notificaciones
        await notificaciones.create([
            {
                idTipoNotificacion: reactivoAgotado._id,
                idReactivo: etanol._id,
                idEquipo: null,
                descripcion: 'Stock de etanol bajo mínimo',
                status: true
            },
            {
                idTipoNotificacion: equipoCalendarizado._id,
                idReactivo: null,
                idEquipo: centrifuga._id,
                descripcion: 'Mantenimiento preventivo requerido',
                status: true
            },
            {
                idTipoNotificacion: actualmenteEnMantenimiento._id,
                idReactivo: null,
                idEquipo: espectrometro._id,
                descripcion: 'Espectrómetro en mantenimiento',
                status: true
            }
        ]);

        // Reservas
        await reservas.create([
            {
                idEquipo: microscopio._id,
                fechaInicio: new Date('2024-03-01'),
                fechaFin: new Date('2024-03-05')
            },
            {
                idEquipo: espectrometro._id,
                fechaInicio: new Date('2024-03-10'),
                fechaFin: new Date('2024-03-12')
            }
        ]);

        // Mantenimientos
        await mantenimientos.create([
            {
                idEquipo: centrifuga._id,
                fechaInicio: new Date('2024-04-01'),
                fechaFin: new Date('2024-04-03')
            },
            {
                idEquipo: espectrometro._id,
                fechaInicio: new Date('2024-05-15'),
                fechaFin: new Date('2024-05-17')
            }
        ]);

        console.log('✅ Datos de prueba insertados correctamente');
        console.log(`📦 Total documentos creados: ${await getTotalDocuments()}`);

    } catch (error) {
        console.error('❌ Error insertando datos:', error);
    } finally {
        mongoose.connection.close();
    }
}

async function getTotalDocuments() {
    const models = mongoose.modelNames();
    let total = 0;

    for (const model of models) {
        total += await mongoose.model(model).countDocuments();
    }

    return total;
}

insertTestData()
