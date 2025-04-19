// IMPORTACIONES
import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import cors from 'cors';

// RUTAS PARA LA API
import reactivoRoutes from './routes/reactivoRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = ['http://localhost:5173']

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});