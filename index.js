// IMPORTACIONES
import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import cors from 'cors';

// RUTAS PARA LA API
import reactivoRoutes from './routes/reactivoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import marcaRoutes from './routes/marcaRoutes.js';
import gabinetesRoutes from './routes/gabineteRoutes.js';
import estadoFisicoRoutes from './routes/estadoFisicoRoutes.js';

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
            callback(new Error('No permitido por CORS'));
        }
    },
};

app.use(cors(corsOptions));

app.use("/api/reactivos", reactivoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/marcas", marcaRoutes);
app.use("/api/gabinetes", gabinetesRoutes);
app.use("/api/estado-fisico", estadoFisicoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});