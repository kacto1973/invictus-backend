import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'Categoria' });

const Categoria = mongoose.model('Categoria', categoriaSchema);
export default Categoria;