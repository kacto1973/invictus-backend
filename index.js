// IMPORTACIONES
import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

// cron jobs
import "./utils/cron/verificarEstadoEquipos.js";

// RUTAS PARA LA API
import reactivoRoutes from "./routes/reactivoRoutes.js";
import equipoRoutes from "./routes/equipos/equipoRoutes.js";
import reservaRoutes from "./routes/equipos/reservaRoutes.js";
import mantenimientoRoutes from "./routes/equipos/mantenimientoRoutes.js";
import inicioRoutes from "./routes/inicioRoutes.js";
import notificacionRoutes from "./routes/notificacionRoutes.js";
import reporteRoutes from "./routes/reporteRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// Rutas combinadas
app.use("/api/reactivos", reactivoRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/equipos/reserva", reservaRoutes);
app.use("/api/equipos/mantenimiento", mantenimientoRoutes);
app.use("/api/inicio", inicioRoutes);
app.use("/api/notificaciones", notificacionRoutes);
app.use("/api/reportes", reporteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});

