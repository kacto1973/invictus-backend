import mongoose from "mongoose";

const unidadMedidaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

const UnidadMedida = mongoose.model('UnidadMedida', unidadMedidaSchema);
export default UnidadMedida;
