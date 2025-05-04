import mongoose from "mongoose";

const tipoMovimientoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'TipoMovimiento' });

const TipoMovimiento = mongoose.model('TipoMovimiento', tipoMovimientoSchema);
export default TipoMovimiento;