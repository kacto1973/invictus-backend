import mongoose from "mongoose";

const unidadMedidaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        enum: ["l", "ml", "kg", "g", "mg"]
    }
});

const UnidadMedida = mongoose.model('UnidadMedida', unidadMedidaSchema);
export default UnidadMedida;
