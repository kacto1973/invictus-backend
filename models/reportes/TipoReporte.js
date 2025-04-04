import mongoose from "mongoose";

const tipoReporteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

const TipoReporte = mongoose.model('TipoReporte', tipoReporteSchema);
export default TipoReporte;