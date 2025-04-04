import mongoose from "mongoose";

const tipoEstadoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    }
});

const TipoEstado = mongoose.model('TipoEstado', tipoEstadoSchema);
export default TipoEstado;