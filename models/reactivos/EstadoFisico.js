import mongoose from "mongoose";

const estadoFisicoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        enum: ["solido", "liquido"]
    }
});

const EstadoFisico = mongoose.model('EstadoFisico', estadoFisicoSchema);
export default EstadoFisico;