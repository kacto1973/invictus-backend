// IMPORTACIONES
import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

// RUTAS PARA LA API
import reactivoRoutes from "./routes/reactivoRoutes.js";
import equipoRoutes from "./routes/equipoRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

app.use("/api/reactivos", reactivoRoutes);
app.use("/api/equipos", equipoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
