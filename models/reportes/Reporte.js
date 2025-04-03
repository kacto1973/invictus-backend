import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
    idTipoReporte: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoReporte',
        required: true
      },
      nombre: {
        type: String,
        required: true
      },
      fechaGeneracion: {
        type: Date,
        default: Date.now
      },
      urlReporte: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      }
});

const Reporte = mongoose.model('Reporte', reporteSchema);
export default Reporte;