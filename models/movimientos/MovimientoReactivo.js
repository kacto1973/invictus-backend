import mongoose from "mongoose";

const movimientoReactivoSchema = new mongoose.Schema({
    idReactivo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reactivo',
      required: true
    },
    idTipoMovimiento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TipoMovimiento',
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    cantidad: {
      type: Number,
      min: 1,
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now,
    }
});

const MovimientoReactivo = mongoose.model("MovimientoReactivo", movimientoReactivoSchema);
export default MovimientoReactivo;