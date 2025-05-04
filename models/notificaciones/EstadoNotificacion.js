import mongoose from "mongoose";

const estadoNotificacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'EstadoNotificacion' });

const EstadoNotificacion = mongoose.model("EstadoNotificacion", estadoNotificacionSchema);
export default EstadoNotificacion;