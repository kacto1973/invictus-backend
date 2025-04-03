import mongoose from "mongoose";

const tipoNotificacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        enum: ["reactivoAgotado", "equipoCalendarizado", "actualmenteEnMantenimiento"]
      }
})

const TipoNotificacion = mongoose.model("TipoNotificacion", tipoNotificacionSchema);
export default TipoNotificacion;