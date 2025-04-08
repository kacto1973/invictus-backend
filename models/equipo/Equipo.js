import mongoose from "mongoose";

const equipoSchema = new mongoose.Schema({
    nombre: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    urlImagen: {
      type: String,
      required: true
    },
    requiereMantenimiento: {
      type: Boolean,
      required: true
    },
    status: {
      type: String,
      required: true
    }
});

const Equipo = mongoose.model('Equipo', equipoSchema);
export default Equipo;