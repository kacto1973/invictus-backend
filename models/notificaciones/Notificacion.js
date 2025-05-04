import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
    idTipoNotificacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TipoNotificacion",
      required: true
    },
    idEstadoNotificacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EstadoNotificacion',
      required: true
    },
    idReactivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reactivo'
    },
    idEquipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipo'
    }, 
    idMantenimiento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mantenimiento'
    },
    descripcion: {
      type: String,
      required: true
    },
    fechaGeneracion: {
      type: Date,
      default: Date.now,
      required: true
    },
    status: {
      type: Boolean,
      default: true,
      required: true
    }
}, { collection: 'Notificacion' });

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
export default Notificacion;