import express from "express";
const router = express.Router();
import {
  getEquipos,
  getEquipoDetails,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  createReserva,
  createMantenimiento,
} from "../controllers/equipoController.js";

router.get("/", getEquipos);
router.get("/detalles", getEquipoDetails);
router.post("/", createEquipo);
router.put("/", updateEquipo);
router.delete("/", deleteEquipo);
router.post("/reserva", createReserva);
router.post("/mantenimiento", createMantenimiento);

export default router;
