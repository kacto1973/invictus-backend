# Opcion de Estructura 2


## Estructura del proyecto
```bash
└── invictus-backend/
    ├── config/
    │   └── ...
    ├── controllers/
    │   └── ...
    ├── middleware/
    │   └── ...
    ├── models/
    │   └── ...
    ├── routes/
    │   └── ...
    └── utils/
    │   └── ...
    ├── .env-template
    ├── .gitignore
    ├── index.js
    ├── package-lock.json
    ├── package.json
    ├── README.md

``` 

* `config/`: Contiene la configuración del proyecto como la conexión a la base de datos.
* `controllers/`: Implementa la lógica de negocio del sistema.
* `middleware/`: Contiene middlewares personalizados.
* `models/`: Define los modelos y esquemas de la base de datos.
* `routes/`: Define los endpoints del proyecto.
* `utils/`: Contiene métodos auxiliares y utilidades.

<br>

## ¿Cómo instalar el proyecto?
1. Clonar el repositorio en tu máquina local usando el siguiente comando:
```
git clone <URL_DEL_REPOSITORIO>
```
2. Navega a la carpeta del proyecto y ejecuta el siguiente comando para instalar las dependencias:
```
npm install
```
3. Crea un archivo `.env` en la raíz del proyecto basado en el archivo `.env-template` y configura las variables necesarias.
4. Usa el siguiente comando para iniciar el servidor:
```
npm start dev
```

<br>

## ¿Cómo contribuir al proyecto?
1. Crea una nueva rama para tus cambios:
```
git checkout -b <nombre-de-tu-rama>
```
2. Realiza tus cambios y súbelos al repositorio:
```
git push origin <nombre-de-tu-rama>
```


> **Abre un Pull Request para su revisión.**
>

<br>

## ¿Cómo trabajar en el proyecto?
### 1. Crear un modelo (si no existe)
Define un modelo en la carpeta `/models` usando Mongoose. Ejemplo:
```javascript
import mongoose from "mongoose";

const reactivoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    cantidad: { type: Number, required: true, min: 0 },
    estado: { type: String, default: "activo" },
    fechaCreacion: { type: Date, default: Date.now }
});

const Reactivo = mongoose.model("Reactivo", reactivoSchema);
export default Reactivo;
```

### 2. Crear una función en el controlador
Define la lógica en un archivo dentro de la carpeta `/controllers`. Ejemplo:
```javascript
import Reactivo from "../models/reactivos/Reactivo.js";

const consultarReactivos = async (req, res) => {
    try {
        const reactivos = await Reactivo.find();
        res.status(200).json(reactivos);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los reactivos" });
    }
};

const crearReactivo = async (req, res) => {
    try {
        const reactivo = new Reactivo(req.body);
        const reactivoGuardado = await reactivo.save();
        res.status(201).json({ message: "Reactivo creado exitosamente", reactivo: reactivoGuardado });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el reactivo" });
    }
};

export { consultarReactivos, crearReactivo };
```

### 3. Definir una ruta
Crea un archivo en la carpeta `/route` para definir las rutas relacionadas con el modelo. Ejemplo:
```javascript
import express from "express";
const router = express.Router();
import { consultarReactivos, crearReactivo } from "../controllers/reactivoController.js";

router.get("/", consultarReactivos);
router.post("/crearReactivo", crearReactivo);

export default router;
```

### 4. Importar el controlador y anexar el router al `index.js`
Importa las rutas en el archivo principal `index.js` y configúralas en el servidor. Ejemplo:
```javascript
import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

import reactivoRoutes from "./routes/reactivoRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();
conectarDB();

app.use("/api/reactivos", reactivoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
```

### 5. Probar las rutas
Puedes usar alguna herramienta como Postman para probar las rutas:
```
GET /api/reactivos: Consultar todos los reactivos.
POST /api/reactivos/crearReactivo: Crear un nuevo reactivo.
```

<br>

> Archivo README.md creado por Pedro López
