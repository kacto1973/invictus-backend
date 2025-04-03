import mongoose from "mongoose";

const estadoNotificacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        enum: ["leido", "noLeido", "eliminado"]
    }
})

const EstadoNotificacion = mongoose.model("EstadoNotificacion", estadoNotificacionSchema);
export default EstadoNotificacion;