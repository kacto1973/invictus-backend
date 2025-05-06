// IMPORTACIONES
import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

// cron jobs
import "./utils/cron/verificarEstadoEquipos.js";
import cors from "cors";

// RUTAS PARA LA API
import reactivoRoutes from "./routes/reactivoRoutes.js";
import equipoRoutes from "./routes/equipos/equipoRoutes.js";
import reservaRoutes from "./routes/equipos/reservaRoutes.js";
import mantenimientoRoutes from "./routes/equipos/mantenimientoRoutes.js";
import movimientoRoutes from "./routes/movimientoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import marcaRoutes from "./routes/marcaRoutes.js";
import gabinetesRoutes from "./routes/gabineteRoutes.js";
import estadoFisicoRoutes from "./routes/estadoFisicoRoutes.js";
import unidadMedidaRoutes from "./routes/unidadMedidaRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// CONFIGURACION DE CORS
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1 || !origin) {
      // El Origen del Request esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/reactivos", reactivoRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/equipos/reserva", reservaRoutes);
app.use("/api/equipos/mantenimiento", mantenimientoRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/marcas", marcaRoutes);
app.use("/api/gabinetes", gabinetesRoutes);
app.use("/api/estado-fisico", estadoFisicoRoutes);
app.use("/api/unidad-medida", unidadMedidaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
