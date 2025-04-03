import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
    idTipoNotificacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TipoNotificacion',
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
    descripcion: {
      type: String,
      required: true
    },
    fechaGeneracion: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Boolean,
      required: true
    }
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);
export default Notificacion;