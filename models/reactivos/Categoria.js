import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
export default Categoria;