import mongoose from "mongoose";

const estadoFisicoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

const EstadoFisico = mongoose.model('EstadoFisico', estadoFisicoSchema);
export default EstadoFisico;