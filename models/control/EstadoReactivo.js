import mongoose from "mongoose";

const estadoReactivoSchema = new mongoose.Schema({
    idReactivo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reactivo',
        required: true
    },
    idTipoEstado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoEstado',
        required: true
    },
    descripcion: {
      type: String,
      required: false
    },
    fecha: {
      type: Date,
      default: Date.now,
      required: true
    },
});
   
const EstadoReactivo = mongoose.model('EstadoReactivo', estadoReactivoSchema);
export default EstadoReactivo;