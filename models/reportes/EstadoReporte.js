import mongoose from "mongoose";

const estadoReporteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

const EstadoReporte = mongoose.model('EstadoReporte', estadoReporteSchema);
export default EstadoReporte;