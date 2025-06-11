import mongoose from "mongoose";
import Equipo from "../../models/equipo/Equipo.js";
import { matchSorter } from "match-sorter";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

/**
 * Obtiene una lista de todos los equipos activos
 * Permite búsqueda por nombre usando el parámetro "name"
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query opcional "name"
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con una lista de equipos o error
 */
const getEquipos = async (req, res) => {
  try {
    let query = req.query.name;

    // buscar solo equipos que no estan "eliminados"
    let equipos = await Equipo.aggregate([
      { $match: { status: { $ne: "Eliminado" } } },
      {
        $lookup: {
          from: "mantenimientos",
          localField: "_id",
          foreignField: "idEquipo",
          as: "mantenimientos",
          pipeline: [{ $match: { status: true } }],
        },
      },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "idEquipo",
          as: "reservas",
          pipeline: [{ $match: { status: true } }],
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
    if (query) equipos = matchSorter(equipos, query);

    if (!equipos.length) {
      return res.status(404).json({ error: "No se encontró ningún equipo" });
    }
    return res.json(equipos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener equipos" });
  }
};

/**
 * Obtiene los detalles de un equipo específico incluyendo sus mantenimientos y reservas
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query "id"
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un equipo o error
 */
const getEquipoDetails = async (req, res) => {
  try {
    let id = req.query.id;

    // checar que el id es un id valido de mongodb
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    // buscar el equipo y tambien las reservas y mantenimientos asociados a su id
    const equipoDetails = await Equipo.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "mantenimientos",
          localField: "_id",
          foreignField: "idEquipo",
          as: "mantenimientos",
          pipeline: [
            {
              $match: { status: true },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "reservas",
          localField: "_id",
          foreignField: "idEquipo",
          as: "reservas",
          pipeline: [
            {
              $match: { status: true },
            },
          ],
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

    if (!equipoDetails.length || equipoDetails[0].status === "Eliminado") {
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

/**
 * Inserta un nuevo equipo en la base de datos y sube su imagen al bucket de Supabase
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con body que contiene los datos del equipo y un archivo "imagen"
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const createEquipo = async (req, res) => {
  try {
    let equipo = req.body;
    let file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }

    // generar nombre unico para el archivo
    const fileName = `${Date.now()}_${file.originalname}`;

    // subir imagen a public/uploads
    const targetPath = path.join(__dirname, `../../public/uploads/${fileName}`);

    fs.writeFile(targetPath, file.buffer, (err) => {
      if (err)
        return res.status(500).json({ error: `Error al subir imagen: ${err}` });
    });

    equipo.urlImagen = `/uploads/${fileName}`;
    equipo.status = "Liberado";
    const nuevoEquipo = await Equipo.create(equipo);

    if (!nuevoEquipo) {
      return res.status(500).json({ error: "El equipo no pudo ser creado" });
    }
    return res.json({
      message: "Equipo creado correctamente",
      id: nuevoEquipo._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear equipo" });
  }
};

/**
 * Actualiza los datos de un equipo existente
 * Opcionalmente reemplaza su imagen si se envía una nueva
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con body que contiene los datos a cambiar del equipo y un archivo opcional "imagen"
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const updateEquipo = async (req, res) => {
  try {
    let equipo = req.body;
    let file = req.file;
    let id = req.query.id;

    // checar que el id es un _id valido de mongodb
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    // verificar que el equipo que se quiere editar si existe
    const equipoExistente = await Equipo.findById(id);
    if (!equipoExistente) {
      return res.status(404).json({ error: "El equipo no existe" });
    }

    if (file) {
      // generar nombre unico para el archivo
      const fileName = `${Date.now()}_${file.originalname}`;

      // obtener path donde se almacenará la nueva imagen
      const targetPath = path.join(
        __dirname,
        `../../public/uploads/${fileName}`
      );

      //obtener el nombre del archivo anterior y eliminarlo
      const oldFileName = equipoExistente.urlImagen.split("uploads/")[1];
      const oldPath = path.join(
        __dirname,
        `../../public/uploads/${oldFileName}`
      );
      fs.unlink(oldPath, (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: `Error al eliminar imagen anterior: ${err}` });
      });

      // insertar la nueva imagen
      fs.writeFile(targetPath, file.buffer, (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: `Error al subir imagen: ${err}` });
      });

      // actualizar el url de la imagen
      equipo.urlImagen = `/uploads/${fileName}`;
    } else {
      // si no hay una nueva imagen, mantener el url original
      equipo.urlImagen = equipoExistente.urlImagen;
    }

    const equipoActualizado = await Equipo.findByIdAndUpdate(id, equipo);

    if (!equipoActualizado) {
      return res.status(500).json({ error: "El equipo no existe" });
    }

    return res.json({ message: "Equipo actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar equipo" });
  }
};

/**
 * Elimina un equipo cambiando su status a "Eliminado"
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetrod de query "id"
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const deleteEquipo = async (req, res) => {
  try {
    let id = req.query.id;

    // checar que el id es un _id valido de mongodb
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    // cambiar el estado a eliminado en lugar de eliminar de verdad :)
    const equipoEliminado = await Equipo.findByIdAndUpdate(id, {
      status: "Eliminado",
    });
    if (!equipoEliminado) {
      return res.status(500).json({ error: "El equipo no existe" });
    }
    return res.json({ message: "Equipo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar equipo" });
  }
};

export {
  getEquipos,
  getEquipoDetails,
  createEquipo,
  updateEquipo,
  deleteEquipo,
};
