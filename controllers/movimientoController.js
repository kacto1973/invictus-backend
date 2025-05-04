import MovimientoReactivo from "../models/movimientos/MovimientoReactivo.js";
import TipoMovimiento from "../models/movimientos/TipoMovimiento.js";
import Reactivo from "../models/reactivos/Reactivo.js";

import { matchSorter } from "match-sorter";

const getMovimientos = async (req, res) => {
  try {
    let { name } = req.query;

    let movimientos = await MovimientoReactivo.find()
      .populate("idTipoMovimiento", "nombre")
      .populate("idReactivo", "nombre cantidad");

    if (!movimientos || movimientos.length === 0) {
      return res.status(404).json({ error: "No se encontraron movimientos" });
    }

    if (name) {
      movimientos = matchSorter(movimientos, name, {
        keys: [(item) => item.idReactivo?.nombre || ""],
      });
    }

    const movimientosFormateados = movimientos.map((mov) => ({
      _id: mov._id,
      descripcion: mov.descripcion,
      cantidad: mov.cantidad,
      fecha: mov.fecha,
      tipoMovimiento: mov.idTipoMovimiento?.nombre || "Desconocido",
      reactivo: {
        id: mov.idReactivo?._id,
        nombre: mov.idReactivo?.nombre,
        cantidad: mov.idReactivo?.cantidad,
      },
    }));

    return res.json(movimientosFormateados);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error al obtener movimientos: ${error}` });
  }
};

const getTipoMovimientos = async (req, res) => {
  try {
    let tiposMovimiento = await TipoMovimiento.find();

    if (!tiposMovimiento || tiposMovimiento.length === 0) {
      return res
        .status(404)
        .json({ error: "No existe ningún tipo de movimiento" });
    }
    return res.json(tiposMovimiento);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error al obtener tipos de movimiento: ${error}` });
  }
};

const createMovimiento = async (req, res) => {
  try {
    const { idReactivo, idTipoMovimiento, descripcion, cantidad } = req.body;

    // checar si cantidad es mayor a 0
    if (!cantidad || cantidad <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad debe ser mayor que 0" });
    }

    // checar si el tipo de movimiento existe
    const tipoMovimiento = await TipoMovimiento.findById(idTipoMovimiento);
    if (!tipoMovimiento) {
      return res
        .status(404)
        .json({ error: "Tipo de movimiento no encontrado" });
    }

    // checar si el reactivo existe
    const reactivo = await Reactivo.findById(idReactivo);
    if (!reactivo) {
      return res.status(404).json({ error: "Reactivo no encontrado" });
    }

    // si el movimiento es salida verificar la cantidad disponible
    if (tipoMovimiento.nombre.toLowerCase() === "salida") {
      if (reactivo.cantidad < cantidad) {
        return res
          .status(400)
          .json({ error: "Cantidad insuficiente en inventario" });
      }
      reactivo.cantidad -= cantidad;
    } else if (tipoMovimiento.nombre.toLowerCase() === "entrada") {
      reactivo.cantidad += cantidad;
    }

    console.log("Reactivo antes de guardar:", reactivo);

    const nuevoMovimiento = new MovimientoReactivo({
      idReactivo,
      idTipoMovimiento,
      descripcion,
      cantidad,
    });

    await nuevoMovimiento.save();
    await reactivo.save();

    return res.json({
      message: "Movimiento creado correctamente",
      id: nuevoMovimiento._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error al crear movimiento: ${error}` });
  }
};

export { getMovimientos, getTipoMovimientos, createMovimiento };
