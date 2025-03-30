/*
Sirve como índice para todas las funciones que usara myApp.js.
Cada vez que alguien agregue una nueva funcion en forma de un archivo, debe importarlo a este archivo.
*/

// Importar las funciones que se van a usar
const { devolverDatosInicio } = require("./devolverDatosInicio");
const { getEquipos } = require("./equipos");

// Aquí se almacenarán todas las funciones
const funciones = {
  devolverDatosInicio,
  getEquipos,
};

// Exportar las funciones que se van a usar
module.exports.funciones = funciones;
