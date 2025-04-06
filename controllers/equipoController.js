import mongoose from "mongoose";
import Equipo from "../models/equipo/Equipo";
import { matchSorter } from "match-sorter";

const getEquipos = async (req, res) => {
  try {
    let query = req.query.name;

    let equipos = await Equipo.find().select("_id nombre urlImagen status");
    if (query) equipos = matchSorter(equipos, query);

    if (!equipos) {
      return res.status(404).json({ error: "No se encontró ningún equipo" });
    }
    return res.json(equipos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener equipos" });
  }
};

const getEquipoDetails = async (req, res) => {
  try {
    let id = req.query.id;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(500).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    const equipoDetails = await Equipo.aggregate([
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
    if (!equipoDetails.length) {
      return res.status(404).json({ error: "El equipo no existe" });
    }
    return res.json(equipoDetails[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al obtener detalles del equipo" });
  }
};

const createEquipo = async (req, res) => {
  try {
    let equipo = req.body;

    const nuevoEquipo = await Equipo.create(equipo);

    if (!nuevoEquipo) {
      return res.status(500).json({ error: "El equipo no pudo ser creado" });
    }
    return res.json({ message: "Equipo creado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear equipo" });
  }
};

export { getEquipos, getEquipoDetails, createEquipo };
