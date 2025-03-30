const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { type } = require("express/lib/response");
require("dotenv").config();
const { funciones } = require("./functions/index"); // Aqui se importan las funciones que se van a usar

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.path} - ${req.ip}`);
  next();
});

// Aquí se empiezan a poner las funciones

app.get("/home/datos", (req, res) => {
  funciones
    .devolverDatosInicio()
    .then((datos) => {
      res.json(datos);
    })
    .catch((error) => {
      console.error("Error al obtener datos para Home:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});

/**
 * ruta que obtiene una solicitud GET con query opcional y regresa una lista de equipos en formato JSON
 *
 * @example
 * request:
 * localhost:3000/equipos?name=microscopio
 *
 * respuesta:
 * [
 *  {
 *    "_id": "67e98b3830d3a9103cb66359",
 *    "nombre": "Microscopio Electrónico",
 *    "descripcion": "Para observación a alta resolución",
 *    "urlImagen": "http://ejemplo.com/microscopio.jpg",
 *    "requiereServicio": false,
 *    "status": "activo"
 *  }
 * ...]
 */
app.get("/equipos", (req, res) => {
  let query;
  if (req.query) {
    query = req.query["name"];
  }
  funciones
    .getEquipos(query)
    .then((equipos) => {
      if (!equipos) {
        res.status(404).json({ error: "No se encontró ningún equipo" });
      }
      res.json(equipos);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Error al obtener equipos" });
    });
});

app.get("/equipos/detalles", (req, res) => {
  let id = req.query["id"];
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(500).json({
      error:
        "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
    });
  }
  funciones
    .getEquipoDetails(id)
    .then((equipo) => {
      if (!equipo) {
        return res.status(404).json({ error: "El equipo no existe" });
      }
      res.json(equipo);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Error al obtener detalles del equipo" });
    });
});

// Aqui inicia el servidor
const listener = app.listen(process.env.PORT, () => {
  console.log("La API inicio en el puerto: " + listener.address().port);
});
