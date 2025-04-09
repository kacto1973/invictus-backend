import mongoose from "mongoose";
import Equipo from "../models/equipo/Equipo.js";
import Reserva from "../models/equipo/Reserva.js";
import Mantenimiento from "../models/equipo/Mantenimiento.js";
import { matchSorter } from "match-sorter";

const getEquipos = async (req, res) => {
  try {
    let query = req.query.name;

    // buscar solo equipos que no estan "eliminados"
    let equipos = await Equipo.find({ status: { $ne: "Eliminado" } }).select(
      "_id nombre urlImagen status"
    );
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

const getEquipoDetails = async (req, res) => {
  try {
    let id = req.query.id;

    // checar que el id es un id valido de mongodb
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(500).json({
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

const createEquipo = async (req, res) => {
  // TODO: manejar imagenes con supabase
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

const updateEquipo = async (req, res) => {
  // TODO: manejar imagenes con supabase
  try {
    let equipo = req.body;
    let id = req.query.id;

    // checar que el id es un _id valido de mongodb
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(500).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    const equipoActualizado = await Equipo.findByIdAndUpdate(id, equipo, {
      new: true,
    });
    if (!equipoActualizado) {
      return res.status(500).json({ error: "El equipo no existe" });
    }
    return res.json({ message: "Equipo actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar equipo" });
  }
};

const deleteEquipo = async (req, res) => {
  try {
    let id = req.query.id;

    // checar que el id es un _id valido de mongodb
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(500).json({
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

const createReserva = async (req, res) => {
  try {
    let id = req.query.id;
    let detallesReserva = req.body;

    // checar que el id es un _id valido de mongodb
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(500).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    const equipo = await Equipo.findById(id);

    if (equipo.status == "Eliminado") {
      return res.status(404).json({ error: "El equipo no existe" });
    }

    // checar si el equipo estará en mantenimiento en la fecha introducida
    const mantenimientosExistentes = await Mantenimiento.find({
      idEquipo: id,
      status: true,
      $or: [
        {
          fechaInicio: { $lte: detallesReserva.fechaFin },
          fechaFin: { $gte: detallesReserva.fechaInicio },
        },
      ],
    });
    if (mantenimientosExistentes.length > 0) {
      return res
        .status(400)
        .json({ error: "El equipo ya estará en mantenimiento en ese periodo" });
    }

    // checar si el equipo ya esta reservado en la fecha introducida
    const reservasExistentes = await Reserva.find({
      idEquipo: id,
      status: true,
      $or: [
        {
          fechaInicio: { $lte: detallesReserva.fechaFin },
          fechaFin: { $gte: detallesReserva.fechaInicio },
        },
      ],
    });
    if (reservasExistentes.length > 0) {
      return res
        .status(400)
        .json({ error: "El equipo ya está reservado en ese periodo" });
    }

    detallesReserva.idEquipo = id;
    detallesReserva.status = true;

    const reservaNueva = await Reserva.create(detallesReserva);

    if (!reservaNueva) {
      return res.status(500).json({ error: "Error al reservar equipo" });
    }

    const hoy = new Date();
    if (
      new Date(detallesReserva.fechaInicio) <= hoy &&
      new Date(detallesReserva.fechaFin) >= hoy
    ) {
      await Equipo.findByIdAndUpdate(id, { status: "En reserva" });
    }

    return res.json({ message: "Equipo reservado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al reservar el equipo" });
  }
};

const createMantenimiento = async (req, res) => {
  try {
    let id = req.query.id;
    let detallesMantenimiento = req.body;

    // checar que el id es un _id valido de mongodb
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(500).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    const equipo = await Equipo.findById(id);

    if (equipo.status == "Eliminado") {
      return res.status(404).json({ error: "El equipo no existe" });
    }

    // checar si el equipo estará en mantenimiento en la fecha introducida
    const mantenimientosExistentes = await Mantenimiento.find({
      idEquipo: id,
      status: true,
      $or: [
        {
          fechaInicio: { $lte: detallesReserva.fechaFin },
          fechaFin: { $gte: detallesReserva.fechaInicio },
        },
      ],
    });
    if (mantenimientosExistentes.length > 0) {
      return res
        .status(400)
        .json({ error: "El equipo ya estará en mantenimiento en ese periodo" });
    }

    // checar si el equipo ya esta reservado en la fecha introducida
    const reservasExistentes = await Reserva.find({
      idEquipo: id,
      status: true,
      $or: [
        {
          fechaInicio: { $lte: detallesReserva.fechaFin },
          fechaFin: { $gte: detallesReserva.fechaInicio },
        },
      ],
    });
    if (reservasExistentes.length > 0) {
      return res
        .status(400)
        .json({ error: "El equipo ya está reservado en ese periodo" });
    }

    detallesMantenimiento.idEquipo = id;
    detallesMantenimiento.status = true;

    const mantenimientoNuevo = await Mantenimiento.create(
      detallesMantenimiento
    );

    if (!mantenimientoNuevo) {
      return res
        .status(500)
        .json({ error: "Error al calendarizar mantenimiento para el equipo" });
    }

    const hoy = new Date();
    if (
      new Date(detallesMantenimiento.fechaInicio) <= hoy &&
      new Date(detallesMantenimiento.fechaFin) >= hoy
    ) {
      await Equipo.findByIdAndUpdate(id, { status: "En mantenimiento" });
    }

    return res.json({ message: "Mantenimiento calendarizado correctamente" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al calendarizar mantenimiento" });
  }
};

export {
  getEquipos,
  getEquipoDetails,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  createReserva,
  createMantenimiento,
};
