import mongoose from "mongoose";

const gabineteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
});

const Gabinete = mongoose.model('Gabinete', gabineteSchema);
export default Gabinete;