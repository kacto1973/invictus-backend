import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  idEquipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  persona: {
    type: String,
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
  fechaAplazamiento: {
    type: Date,
    required: false
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  }
});

const Reserva = mongoose.model('Reserva', reservaSchema);
export default Reserva;