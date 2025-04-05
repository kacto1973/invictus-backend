import mongoose from "mongoose";

const tipoMovimientoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

const TipoMovimiento = mongoose.model('TipoMovimiento', tipoMovimientoSchema);
export default TipoMovimiento;