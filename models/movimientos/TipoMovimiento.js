import mongoose from "mongoose";

const tipoMovimientoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        enum: ["salida", "entrada"]
    }
});

const TipoMovimiento = mongoose.model('TipoMovimiento', tipoMovimientoSchema);
export default TipoMovimiento;