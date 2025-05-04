import express from "express";
const router = express.Router();

import {
  getMovimientos,
  getTipoMovimientos,
  createMovimiento,
} from "../controllers/movimientoController.js";

router.get("/", getMovimientos);
router.get("/tipos", getTipoMovimientos);
router.post("/", createMovimiento);

export default router;
