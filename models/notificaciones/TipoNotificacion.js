import mongoose from "mongoose";

const tipoNotificacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
      }
}, { collection: 'TipoNotificacion' });

const TipoNotificacion = mongoose.model("TipoNotificacion", tipoNotificacionSchema);
export default TipoNotificacion;