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
        required: true
    },
    idUnidadMedida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnidadMedida', 
        required: true
    },
    estadoFisico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstadoFisico', 
        required: true
    },
    nombre: {
        type: String,
        required: true
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
        type: String,
    },
    presentacion: {
        type: Number,
        required: true,
        min: 0
    }
});

const Reactivo = mongoose.model('Reactivo', reactivoSchema);
export default Reactivo;