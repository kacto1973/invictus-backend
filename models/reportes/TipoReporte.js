import mongoose from "mongoose";

const tipoReporteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});