import express from "express";
const router = express.Router();
import {
  getEquipos,
  getEquipoDetails,
  createEquipo,
} from "../controllers/equipoController";

router.get("/equipos", getEquipos);
router.get("/equipos/detalles", getEquipoDetails);
router.post("/equipos", createEquipo);
