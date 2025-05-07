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
    idEstadoFisico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstadoFisico', 
        required: true
    },
    idCategoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria', 
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    codigoCatalogo: {
        type: String,
        required: false,
        unique: false
    },
    esPeligroso: {
        type: Boolean,
        required: true
    },
    cantidad: {
        type: Number,
        default: 0,
        required: false
    },
    unidadMedida: {
        valor: {
            type: String,
            required: true
        },
        idUnidadMedida: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UnidadMedida',
            required: true
        }
    },
    status: {
        type: Boolean,
        default: true
    }
}, { collection: 'Reactivo' });

const Reactivo = mongoose.model('Reactivo', reactivoSchema);
export default Reactivo;
