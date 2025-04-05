// Este archivo es de prueba, elimina datos los datos utilizados en el test.

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
    tiposNotificaciones,
    equipos,
    reservas,
    mantenimientos,
    motivos
} = require('./schemas');

// Eliminar todos los datos de prueba

async function deleteTestData() {
    try {
        await reactivos.deleteMany({});
        await gabinetes.deleteMany({});
        await marcas.deleteMany({});
        await unidadesMedidas.deleteMany({});
        await estadosFisicos.deleteMany({});
        await reactivosDefectuosos.deleteMany({});
        await movimientosReactivos.deleteMany({});
        await tiposMovimientos.deleteMany({});
        await reportes.deleteMany({});
        await tiposReportes.deleteMany({});
        await notificaciones.deleteMany({});
        await tiposNotificaciones.deleteMany({});
        await equipos.deleteMany({});
        await reservas.deleteMany({});
        await mantenimientos.deleteMany({});
        await motivos.deleteMany({});

        console.log('Datos de prueba eliminados correctamente');
    } catch (error) {
        console.error('Error al eliminar los datos de prueba:', error);
    } finally {
        mongoose.connection.close();
    }
}

deleteTestData().then(r => {
    console.log("Se borro todo!");
});