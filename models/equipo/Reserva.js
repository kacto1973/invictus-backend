import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  idEquipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipo",
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  usuario: {
    // TODO: cambiar a id de usuario cuando se implemente
    type: String,
    required: true,
  },
  fechaInicio: {
    type: Date,
    default: Date.now,
    required: true,
  },
  fechaFin: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Reserva = mongoose.model("Reserva", reservaSchema);
export default Reserva;
