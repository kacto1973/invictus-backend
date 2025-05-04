import express from "express";
const router = express.Router();

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

import {
  getEquipos,
  getEquipoDetails,
  createEquipo,
  updateEquipo,
  deleteEquipo,
} from "../../controllers/equipos/equipoController.js";

// TODO: agregar documentación
router.get("/", getEquipos);
router.get("/detalles", getEquipoDetails);
router.post("/", upload.single("imagen"), createEquipo);
router.put("/", upload.single("imagen"), updateEquipo);
router.delete("/", deleteEquipo);

export default router;
