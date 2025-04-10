import express from "express";
const router = express.Router();

import {
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento,
} from "../../controllers/equipos/mantenimientoController.js";

// TODO: agregar documentación
router.post("/", createMantenimiento);
router.put("/", updateMantenimiento);
router.delete("/", deleteMantenimiento);

export default router;
