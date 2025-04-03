import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
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

const Reserva = mongoose.model('Reserva', reservaSchema);
export default Reserva;