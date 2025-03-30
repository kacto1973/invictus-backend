const { equipos } = require("./database/schemas");
const { matchSorter } = require("match-sorter");

/**
 * obtiene una lista de todos los equipos y opcionalmente filtra los resultados según un query
 *
 * @async
 * @param {string} [query] - query opcional para filtrar los equipos por nombre
 * @returns {Promise<Array>} - lista de equipos, si se pasa un query la lista contendrá solo los elementos que coinciden
 */
async function getEquipos(query) {
  let equiposList = await equipos.find().select("-__v");
  if (query) equiposList = matchSorter(equiposList, query);

  return equiposList;
}

/**
 * obtiene los detalles de un equipo a partir de su id
 *
 * @async
 * @param {string} id - el id principal del equipo, generado automaticamente por mongodb en el campo _id
 * @returns {Promise<Object|null>} - objeto que contiene _id,nombre,descripción,urlImagen,requiereServicio y status del equipo
 */
async function getEquipoDetails(id) {
  const equipoDetails = await equipos.findById(id).select("-__v");
  return equipoDetails;
}

module.exports = { getEquipos, getEquipoDetails };
