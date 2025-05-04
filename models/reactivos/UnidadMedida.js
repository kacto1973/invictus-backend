import mongoose from "mongoose";

const unidadMedidaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'UnidadMedida' });

const UnidadMedida = mongoose.model('UnidadMedida', unidadMedidaSchema);
export default UnidadMedida;
