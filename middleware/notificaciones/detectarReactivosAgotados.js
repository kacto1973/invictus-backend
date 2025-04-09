import Notificacion from "../../models/notificaciones/Notificacion.js";
import Reactivo from "../../models/reactivos/Reactivo.js"
import conseguirIDTipoNotificacion from "./ConseguirIDs/conseguirIDTipoNotificacion.js";
import conseguirIDEstadoNotificacion from "./ConseguirIDs/conseguirIDEstadoNotificacion.js";

const observarAgotados = async () => {
    const pipeline = [{ $match: { 'updateDescription.updatedFields.cantidad': { $exists: true } } }];
    const changeStream = Reactivo.watch(pipeline);
    const listaTipoNotificacion = await conseguirIDTipoNotificacion();
    const listaEstadoNotificacion = await conseguirIDEstadoNotificacion();

    changeStream.on('change', async (change) => {
        const nuevoValor = change.updateDescription.updatedFields.cantidad;
        const idReactivo = change.documentKey._id;

        const reactivo = await Reactivo.findById(idReactivo);

        if (nuevoValor === 0) { // Agrega la notificacion si la cantidad es 0
            const existeNotificacion = await Notificacion.findOne({ idReactivo, status: true });
            if (!existeNotificacion) { // Esta consigue la fecha actual en UTC
                const fechaActual = new Date();
                fechaActual.setHours(fechaActual.getHours() - 7);
                await Notificacion.create({
                    idTipoNotificacion: listaTipoNotificacion[0], // Reactivo Agotado
                    idEstadoNotificacion: listaEstadoNotificacion[1], // Sin leer
                    idReactivo: idReactivo,
                    descripcion: `Actualmente no contamos con ${reactivo.nombre} en inventario.`,
                    fechaGeneracion: fechaActual,
                    status: true
                });
                console.log(`El Reactivo ${reactivo.nombre} esta agotado.`);
            }
        } else if (nuevoValor > 0) { // Elimina la notificacion si el valor ya no es 0
            await Notificacion.deleteMany({ idReactivo });
            console.log(`El Reactivo ${reactivo.nombre} ya no esta agotado.`);
        }
    });
};

export default observarAgotados;