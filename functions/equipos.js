const { equipos } = require("./database/schemas");
const { matchSorter } = require("match-sorter");

/**
 * obtiene una lista de todos los equipos y opcionalmente filtra los resultados según un query
 * @async
 * @param {string} [query] - query opcional para filtrar los equipos por nombre
 * @returns {Promise<Array>} - lista de equipos, si se pasa un query la lista contendrá solo los elementos que coinciden
 */
async function getEquipos(query) {
  let equiposList = await equipos.find().select("-__v");
  if (query) equiposList = matchSorter(equiposList, query);

  return equiposList;
}

module.exports = { getEquipos };
