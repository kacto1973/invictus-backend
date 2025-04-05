const mongoose = require("mongoose");
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
  let equiposList = await equipos.find().select("_id nombre urlImagen status");
  if (query) equiposList = matchSorter(equiposList, query);

  return equiposList;
}

/**
 * obtiene los detalles de un equipo a partir de su id
 *
 * @async
 * @param {string} id - el id principal del equipo, generado automaticamente por mongodb en el campo _id
 * @returns {Promise<Object|null>} - objeto que contiene _id,nombre,descripción,urlImagen,requiereServicio, status, mantenimientos y reservas del equipo
 */
async function getEquipoDetails(id) {
  try {
    const equipoDetails = await equipos.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "mantenimientos",
          localField: "_id",
          foreignField: "equipoId",
          as: "mantenimientos",
        },
      },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "idEquipo",
          as: "reservas",
        },
      },
      {
        $project: {
          __v: 0,
          "reservas.idEquipo": 0,
          "mantenimientos.idEquipo": 0,
        },
      },
    ]);
    return equipoDetails.length ? equipoDetails[0] : null;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Error al obtener datos del equipo con id ${id}: ${error.message}`
    );
  }
}

async function createEquipo(equipo) {
  const nuevoEquipo = await equipos.create(equipo);
  return nuevoEquipo;
}

module.exports = { getEquipos, getEquipoDetails, createEquipo };
