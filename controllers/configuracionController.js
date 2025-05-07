import EstadoReactivo from "../models/control/EstadoReactivo.js";
import TipoEstado from "../models/control/TipoEstado.js";
import Equipo from "../models/equipo/Equipo.js";
import Mantenimiento from "../models/equipo/Mantenimiento.js";
import Reserva from "../models/equipo/Reserva.js";
import MovimientoReactivo from "../models/movimientos/MovimientoReactivo.js";
import TipoMovimiento from "../models/movimientos/TipoMovimiento.js";
import EstadoNotificacion from "../models/notificaciones/EstadoNotificacion.js";
import Notificacion from "../models/notificaciones/Notificacion.js";
import TipoNotificacion from "../models/notificaciones/TipoNotificacion.js";
import Categoria from "../models/reactivos/Categoria.js";
import EstadoFisico from "../models/reactivos/EstadoFisico.js";
import Gabinete from "../models/reactivos/Gabinete.js";
import Marca from "../models/reactivos/Marca.js";
import Reactivo from "../models/reactivos/Reactivo.js";
import UnidadMedida from "../models/reactivos/UnidadMedida.js";
import EstadoReporte from "../models/reportes/EstadoReporte.js";
import Reporte from "../models/reportes/Reporte.js";
import fs from "fs";
import path from "path";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const generarRespaldo = async (req, res) => {
    if (req.body.password !== process.env.SUPERUSER_PASSWORD) {
        return res.status(403).json({ error: "Acceso denegado" });
    }
    try {
        const respaldo = {
            estadoReactivo: await EstadoReactivo.find(),
            tipoEstado: await TipoEstado.find(),
            equipo: await Equipo.find(),
            mantenimiento: await Mantenimiento.find(),
            reserva: await Reserva.find(),
            movimientoReactivo: await MovimientoReactivo.find(),
            tipoMovimiento: await TipoMovimiento.find(),
            estadoNotificacion: await EstadoNotificacion.find(),
            notificacion: await Notificacion.find(),
            tipoNotificacion: await TipoNotificacion.find(),
            categoria: await Categoria.find(),
            estadoFisico: await EstadoFisico.find(),
            gabinete: await Gabinete.find(),
            marca: await Marca.find(),
            reactivo: await Reactivo.find(),
            unidadMedida: await UnidadMedida.find(),
            estadoReporte: await EstadoReporte.find(),
            reporte: await Reporte.find(),
        };

        const jsonStr = JSON.stringify(respaldo, null, 2);
        res.setHeader("Content-Disposition", "attachment; filename=respaldo.json");
        res.setHeader("Content-Type", "application/json");
        res.send(jsonStr);
    } catch (err) {
        console.error("Error al generar respaldo:", err);
        res.status(500).json({ error: "No se pudo generar el respaldo" });
    }
};

const restaurarRespaldo = async (req, res) => {
    if (req.body.password !== process.env.SUPERUSER_PASSWORD) {
        return res.status(403).json({ error: "Acceso denegado" });
    }
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se envió ningún archivo" });
        }

        const filePath = path.resolve(req.file.path);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        await Promise.all([
            EstadoReactivo.deleteMany(),
            TipoEstado.deleteMany(),
            Equipo.deleteMany(),
            Mantenimiento.deleteMany(),
            Reserva.deleteMany(),
            MovimientoReactivo.deleteMany(),
            TipoMovimiento.deleteMany(),
            EstadoNotificacion.deleteMany(),
            Notificacion.deleteMany(),
            TipoNotificacion.deleteMany(),
            Categoria.deleteMany(),
            EstadoFisico.deleteMany(),
            Gabinete.deleteMany(),
            Marca.deleteMany(),
            Reactivo.deleteMany(),
            UnidadMedida.deleteMany(),
            EstadoReporte.deleteMany(),
            Reporte.deleteMany(),
        ]);

        await Promise.all([
            EstadoReactivo.insertMany(data.estadoReactivo || []),
            TipoEstado.insertMany(data.tipoEstado || []),
            Equipo.insertMany(data.equipo || []),
            Mantenimiento.insertMany(data.mantenimiento || []),
            Reserva.insertMany(data.reserva || []),
            MovimientoReactivo.insertMany(data.movimientoReactivo || []),
            TipoMovimiento.insertMany(data.tipoMovimiento || []),
            EstadoNotificacion.insertMany(data.estadoNotificacion || []),
            Notificacion.insertMany(data.notificacion || []),
            TipoNotificacion.insertMany(data.tipoNotificacion || []),
            Categoria.insertMany(data.categoria || []),
            EstadoFisico.insertMany(data.estadoFisico || []),
            Gabinete.insertMany(data.gabinete || []),
            Marca.insertMany(data.marca || []),
            Reactivo.insertMany(data.reactivo || []),
            UnidadMedida.insertMany(data.unidadMedida || []),
            EstadoReporte.insertMany(data.estadoReporte || []),
            Reporte.insertMany(data.reporte || []),
        ]);

        fs.unlinkSync(filePath);
        res.json({ mensaje: "Restauración completa" });
    } catch (err) {
        console.error("Error al restaurar respaldo:", err);
        res.status(500).json({ error: "Error al restaurar la base de datos" });
    }
};

export { generarRespaldo, restaurarRespaldo, upload  };