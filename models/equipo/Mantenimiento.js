import mongoose from "mongoose";

const mantenimientoSchema = new mongoose.Schema({
    idEquipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipo',
        required: true
      },
      fechaInicio: {
        type: Date,
        required: true
      },
      fechaFin: {
        type: Date,
        required: true
      },
});

const Mantenimiento = mongoose.model('Mantenimiento', mantenimientoSchema);
export default Mantenimiento;