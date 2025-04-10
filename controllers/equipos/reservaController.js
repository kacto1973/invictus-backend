import mongoose from "mongoose";
import Reserva from "../../models/equipo/Reserva.js";
import Mantenimiento from "../../models/equipo/Mantenimiento.js";
import Equipo from "../../models/equipo/Equipo.js";

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const validarFechas = (inicio, fin) => {
  return new Date(fin) > new Date(inicio);
};

/**
 * Registra una nueva reserva para un equipo
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query "id" y body con la información de la reserva
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const createReserva = async (req, res) => {
  try {
    let id = req.query.id;
    let detallesReserva = req.body;

    // checar que el id es un _id valido de mongodb
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    if (!validarFechas(detallesReserva.fechaInicio, detallesReserva.fechaFin)) {
      return res.status(400).json({
        error: "La fecha de fin no puede ser menor a la fecha de inicio",
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

    new Date(new Date().setUTCHours(0, 0, 0, 0));
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

/**
 * Actualiza la información de una reserva existente
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query "id" y body con la información actualizada de la reserva
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const updateReserva = async (req, res) => {
  let detallesReserva = req.body;
  let id = req.query.id;

  // checar que el id es un _id valido de mongodb
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error:
        "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
    });
  }

  if (detallesReserva.fechaInicio && detallesReserva.fechaFin) {
    if (!validarFechas(detallesReserva.fechaInicio, detallesReserva.fechaFin)) {
      return res.status(400).json({
        error: "La fecha de fin no puede ser menor a la fecha de inicio",
      });
    }
  }

  // verificar que la reserva que se quiere modificar si existe
  const reservaExistente = await Reserva.findById(id);
  if (!reservaExistente) {
    return res.status(404).json({ error: "La reserva no existe" });
  }

  const reservaActualizada = await Reserva.findByIdAndUpdate(
    id,
    detallesReserva
  );

  if (!reservaActualizada) {
    return res.status(500).json({ error: "La reserva no existe" });
  }

  return res.json({ message: "Reserva actualizada correctamente" });
};

/**
 * Elimina una reserva cambiando su status a false
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query "id"
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const deleteReserva = async (req, res) => {
  try {
    let id = req.query.id;

    // checar que el id es un _id valido de mongodb
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }
    const reserva = await Reserva.findByIdAndUpdate(id, { status: false });
    if (!reserva) {
      return res.status(404).json({ error: "La reserva no existe" });
    }
    return res.json({ message: "Reserva eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar reserva" });
  }
};

export { createReserva, updateReserva, deleteReserva };
