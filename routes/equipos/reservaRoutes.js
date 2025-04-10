import express from "express";
const router = express.Router();

import {
  createReserva,
  updateReserva,
  deleteReserva,
} from "../../controllers/equipos/reservaController.js";

// TODO: agregar documentación
router.post("/", createReserva);
router.put("/", updateReserva);
router.delete("/", deleteReserva);

export default router;
