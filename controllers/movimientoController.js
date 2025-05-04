import MovimientoReactivo from "../models/movimientos/MovimientoReactivo.js";
import TipoMovimiento from "../models/movimientos/TipoMovimiento.js";
import Reactivo from "../models/reactivos/Reactivo.js";

const getMovimientos = async (req, res) => {
  try {
    let query = req.query.name;

    let movimientos = MovimientoReactivo.find()
      .populate("idTipoMovimiento", "nombre")
      .populate("idReactivo", "nombre");

    console.log(movimientos);
  } catch (error) {}
};

const getTipoMovimientos = async (req, res) => {
  try {
    let tiposMovimiento = TipoMovimiento.find();

    if (!tiposMovimiento) {
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

    const nuevoMovimiento = new Movimiento({
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
