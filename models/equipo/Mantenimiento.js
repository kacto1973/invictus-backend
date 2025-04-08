import mongoose from "mongoose";

const mantenimientoSchema = new mongoose.Schema({
  idEquipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  fechaInicio: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  proximoMantenimiento: {
    type: Date,
    required: false
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  }
});

const Mantenimiento = mongoose.model('Mantenimiento', mantenimientoSchema);
export default Mantenimiento;