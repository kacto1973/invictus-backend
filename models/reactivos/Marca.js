import mongoose from "mongoose";

const marcaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});

const Marca = mongoose.model('Marca', marcaSchema);
export default Marca;