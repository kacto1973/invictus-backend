
# Opcion de Estructura 1 para Back-End Invictus

Esta es la primera opcion ofrecida para ser la estructura del proyecto Back-End. Otras opciones se pueden dar.
## Como usar este formato

Primeramente, debes crear un archivo .env con dos variables:

`MONGO_URI`: Contiene la URL de tu MongoDB.

`PORT`: Contiene el puerto en el que funcionara NodeJS.

Segundo, tienes que correr el siguiente comando, con esto instalaras todas las dependencias necesarias.:

```bash
  npm install
```

Tercero, se va a usar los comandos de test, para meter datos a la base de datos y comprobar que funciona. Para ello se usa el siguiente comando:

```bash
  npm run testCreate
```

Cuarto, esto es opcional, si quieres eliminar todos los datos de la base de datos, usa el siguiente comando:

```bash
  npm run testDelete
```




## ¿Como ingresar una nueva funcion?

Este el arbol del proyecto:

```bash
  .
└── Carpeta Principal/
    ├── myApp.js
    ├── package.json
    ├── package-lock.json
    ├── .env
    ├── node-modules/
    │   └── (Muchas carpetas)
    └── functions/
        ├── database/
        │   ├── connect.js
        │   ├── schemas.js
        │   ├── testCreate.js
        │   └── testDelete.js
        ├── (funciones)
        └── index.js
``` 
-----
\
Para crear una nueva funcion se debe crear un nuevo archivo .js en la carpeta functions, con el nombre de lo que va desempeñar, el archivo debe contener el siguiente formato:

```bash
const {
    reactivos, gabinetes, marcas, unidadesMedidas, estadosFisicos, reactivosDefectuosos,
    movimientosReactivos, tiposMovimientos, reportes, tiposReportes, notificaciones,
    tiposNotificaciones, equipos, reservas, mantenimientos, motivos
} = require('./database/schemas');
// Quitar las que no necesites

function funcionEjemplo () {}

module.exports = { funcionEjemplo };
```

La primer variable sirve para acceder a los esquemas de MongoDB y con ello ingresar informacion o conseguir informacion. Una vez que termines de crear tu funcion, elimina los esquemas que no utilizaste.

La funcion que crees debe exportarse luego como se demuestra al final del codigo, esto para utilizarse en myApp.js.

-----
\
Ahora, en index.js, se usara el siguiente formato:

```bash
const { funcion1 } = require('./ArchivoDondeEstafuncion1');
const { funcion2 } = require('./ArchivoDondeEstafuncion2');
const { funcionEjemplo } = require('./ArchivoDondeEstafuncionEjemplo');

// Aquí se almacenarán todas las funciones
const funciones = {
    funcion1,
    funcion2...
    funcionEjemplo
};

// Exportar las funciones que se van a usar
module.exports.funciones = funciones
```

Debes crear una variable al principio que importe la funcion que creaste, luego agregala a la variable funciones.

-----
\
Por ultimo, debes agregar a la funcion a myApp.js en donde especifiques la URL para acceder a esta funcion, la forma en que se enviaran los datos, el mensaje de error que se le enviara a la peticion de la API y el error que aparecera en los Logs. Ejemplo:

```bash
app.get("/home/datos", (req, res) => {
  funciones.devolverDatosInicio().then(datos => {
    res.json(datos);
  }).catch(error => {
    console.error("Error al obtener datos para Home:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  });
});
```