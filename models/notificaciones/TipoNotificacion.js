import mongoose from "mongoose";

const tipoNotificacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
      }
})

const TipoNotificacion = mongoose.model("TipoNotificacion", tipoNotificacionSchema);
export default TipoNotificacion;