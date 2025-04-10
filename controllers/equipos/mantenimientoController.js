import mongoose from "mongoose";
import Mantenimiento from "../../models/equipo/Mantenimiento.js";
import Reserva from "../../models/equipo/Reserva.js";
import Equipo from "../../models/equipo/Equipo.js";

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const validarFechas = (inicio, fin) => {
  return new Date(fin) > new Date(inicio);
};

/**
 * Registra un nuevo mantenimiento para un equipo
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query "id" y body con la información del mantenimiento
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const createMantenimiento = async (req, res) => {
  try {
    let id = req.query.id;
    let detallesMantenimiento = req.body;

    // checar que el id es un _id valido de mongodb
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }

    if (
      !validarFechas(
        detallesMantenimiento.fechaInicio,
        detallesMantenimiento.fechaFin
      )
    ) {
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
          fechaInicio: { $lte: detallesMantenimiento.fechaFin },
          fechaFin: { $gte: detallesMantenimiento.fechaInicio },
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
          fechaInicio: { $lte: detallesMantenimiento.fechaFin },
          fechaFin: { $gte: detallesMantenimiento.fechaInicio },
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

    const hoy = new Date(new Date().setUTCHours(0, 0, 0, 0));
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

/**
 * Actualiza la información de un mantenimiento existente
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query "id" y body con la información actualizada del mantenimiento
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const updateMantenimiento = async (req, res) => {
  let detallesMantenimiento = req.body;
  let id = req.query.id;

  // checar que el id es un _id valido de mongodb
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      error:
        "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
    });
  }

  if (detallesMantenimiento.fechaInicio && detallesMantenimiento.fechaFin) {
    if (
      !validarFechas(
        detallesMantenimiento.fechaInicio,
        detallesMantenimiento.fechaFin
      )
    ) {
      return res.status(400).json({
        error: "La fecha de fin no puede ser menor a la fecha de inicio",
      });
    }
  }

  // verificar que la Mantenimiento que se quiere modificar si existe
  const MantenimientoExistente = await Mantenimiento.findById(id);
  if (!MantenimientoExistente) {
    return res.status(404).json({ error: "El mantenimiento no existe" });
  }

  const mantenimientoActualizado = await Mantenimiento.findByIdAndUpdate(
    id,
    detallesMantenimiento
  );

  if (!mantenimientoActualizado) {
    return res.status(500).json({ error: "El mantenimiento no existe" });
  }

  return res.json({ message: "Mantenimiento actualizado correctamente" });
};

/**
 * Elimina un mantenimiento cambiando su status a false
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP con parámetro de query "id"
 * @param {import("express").Response} res - Objeto de respuesta HTTP
 * @returns {Promise<Response>} Respuesta JSON con un mensaje de éxito o error
 */
const deleteMantenimiento = async (req, res) => {
  try {
    let id = req.query.id;

    // checar que el id es un _id valido de mongodb
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error:
          "El parámetro id debe tener una longitud de 24 caracteres hexadecimales",
      });
    }
    const mantenimiento = await Mantenimiento.findByIdAndUpdate(id, {
      status: false,
    });
    if (!mantenimiento) {
      return res.status(404).json({ error: "El mantenimiento no existe" });
    }
    return res.json({ message: "Mantenimiento eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar mantenimiento" });
  }
};

export { createMantenimiento, updateMantenimiento, deleteMantenimiento };
