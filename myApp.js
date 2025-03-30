const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
const { type } = require('express/lib/response');
require('dotenv').config()
const { funciones } = require('./functions/index'); // Aqui se importan las funciones que se van a usar

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>{
  console.log(`${req.method} - ${req.path} - ${req.ip}`)
  next();
});

// Aquí se empiezan a poner las funciones

app.get("/home/datos", (req, res) => {
  funciones.devolverDatosInicio().then(datos => {
    res.json(datos);
  }).catch(error => {
    console.error("Error al obtener datos para Home:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  });
});


// Aqui inicia el servidor
const listener = app.listen(process.env.PORT, () => {
  console.log('La API inicio en el puerto: ' + listener.address().port);
});
