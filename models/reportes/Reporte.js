import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
    idEstadoReporte: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstadoReporte',
        required: true
      },
      nombre: {
        type: String,
        required: true
      },
      fechaGeneracion: {
        type: Date,
        default: Date.now,
        required: true
      },
      urlReporte: {
        type: String,
        required: true
      },
      status: {
        type: Boolean,
        required: true
      }
}, { collection: 'Reporte' });

const Reporte = mongoose.model('Reporte', reporteSchema);
export default Reporte;