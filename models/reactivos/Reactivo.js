import mongoose from "mongoose";

const reactivoSchema = new mongoose.Schema({
    idGabinete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gabinete', 
        required: true
    },
    idMarca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marca', 
        required: false
    },
    idUnidadMedida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnidadMedida', 
        required: true
    },
    idCategoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria', 
        required: true
    },
    idEstadoFisico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstadoFisico', 
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    codigoCatalogo: {
        type: String,
        required: false,
        unique: true
    },
    esPeligroso: {
        type: Boolean,
        required: true
    },
    cantidad: {
        type: Number,
        min: 0,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    }
}, { collection: 'Reactivo' });

const Reactivo = mongoose.model('Reactivo', reactivoSchema);
export default Reactivo;