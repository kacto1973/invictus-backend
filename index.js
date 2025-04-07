// IMPORTACIONES
import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';

// RUTAS PARA LA API
import reactivoRoutes from './routes/reactivoRoutes.js';
import inicioRoutes from './routes/inicioRoutes.js';
import notificacionRoutes from './routes/notificacionRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

app.use("/api/reactivos", reactivoRoutes);
app.use("/api/inicio", inicioRoutes);
app.use("/api/notificaciones", notificacionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});