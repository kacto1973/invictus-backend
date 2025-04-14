import Reporte from "../models/reportes/Reporte.js";
import { supabase } from "../config/supabase.js";
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import PDFDocument from "pdfkit-table"
import MovimientoReactivo from "../models/movimientos/MovimientoReactivo.js";
import TipoMovimiento from "../models/movimientos/TipoMovimiento.js"; // No borrar, necesita que inicialice
import Reactivo from "../models/reactivos/Reactivo.js";

const conseguirTodosLosReportes = async (req, res) => {
    /**
     * Obtiene todos los reportes de la base de datos.
     * @returns {JSON} - Lista de reportes.
     */
    try {
        const reportes = await Reporte.find();
        res.status(200).json(reportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los reportes" });
    }
}

async function insertarTablaConChequeo(doc, data) {
    const espacioMinimo = 100;

    if (doc.y + espacioMinimo >= doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
    }

    await doc.table(data);
}

async function crearGrafico(opcion) {
    // graficaEntradasSalidas     = 1
    // graficaCategoriasReactivos = 2
    // graficaReactivosAgotados   = 3
    // graficaUsodeEquipos        = 4
    // graficaServicioEquipos     = 5

    const width = 600;
    const height = 400;
    const chartCanvas  = new ChartJSNodeCanvas({ width, height });

    let config;

    switch (opcion) {
        case 1: {
            const movimientos = await MovimientoReactivo
                .find()
                .populate("idReactivo")
                .populate("idTipoMovimiento");

            let totalEntradas = 0;
            let totalSalidas = 0;

            movimientos.forEach(mov => {
                const tipo = mov.idTipoMovimiento.nombre;
                if (tipo === 'Entrada') {
                    totalEntradas += mov.cantidad;
                } else if (tipo === 'Salida') {
                    totalSalidas += mov.cantidad;
                }
            });

            config = {
                type: 'pie',
                data: {
                    labels: [
                        `Entradas (${totalEntradas})`,
                        `Salidas (${totalSalidas})`
                    ],
                    datasets: [{
                        label: 'Movimientos de Reactivos',
                        data: [totalEntradas, totalSalidas],
                        backgroundColor: ['#4CAF50', '#F44336'],
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Porcentaje de Movimientos de Reactivos',
                            font: {
                                size: 18
                            }
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    }
                }
            };

            break;
        }
    }

    return await chartCanvas.renderToBuffer(config);

}

async function crearTabla(opcion){
    // listadoReactivos        = 1
    // listadoEntradasSalidas  = 2
    // listadoEquipos          = 3
    // listadoServicios        = 4
    // listadoUsos             = 5
    let table;

    switch (opcion) {
        case 1: {
            const reactivos = await Reactivo.find({status: true})
                .populate("idUnidadMedida")
                .populate("estadoFisico")
                .populate("idMarca")
                .populate("idGabinete");

            let datos = [];

            reactivos.forEach(rea => {
                datos.push([
                    rea.nombre,
                    rea.idGabinete.nombre,
                    rea.idMarca.nombre,
                    rea.idUnidadMedida.nombre,
                    rea.estadoFisico.nombre,
                    rea.esPeligroso,
                    rea.cantidad
                ]);
            })

            table = {
                title: 'Lista Completa de Reactivos',
                headers: [
                    "Nombre",
                    "Gabinete",
                    "Marca",
                    "Unidad",
                    "Estado Fisico",
                    "¿Es peligroso?",
                    "Cantidad"
                ],
                rows: datos
            };

            break;
        }
    }

    return table;
}

const crearReporte = async (req, res) => {
    try {
        const {
            listadoReactivos,
            listadoEntradasSalidas,
            listadoEquipos,
            listadoServicios,
            listadoUsos,
            graficaCategoriasReactivos,
            graficaEntradasSalidas,
            graficaReactivosAgotados,
            graficaUsodeEquipos,
            graficaServicioEquipos,
        } = req.body;

        const doc = new PDFDocument();

        // Aqui se agregaran las tablas del PDF
        let tablas = [];
        // Le pregunte al chat si habia una manera mejor de hacer esto y solio me
        // dio opciones que consumen mas recursos
        if (listadoReactivos) {
            const tabla = await crearTabla(1);
            tablas.push(tabla);
        }
        if (listadoEntradasSalidas) {
            const tabla = await crearTabla(2);
            tablas.push(tabla);
        }
        if (listadoEquipos) {
            const tabla = await crearTabla(3);
            tablas.push(tabla);
        }
        if (listadoServicios) {
            const tabla = await crearTabla(4);
            tablas.push(tabla);
        }
        if (listadoUsos) {
            const tabla = await crearTabla(5);
            tablas.push(tabla);
        }
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el reporte" });
    }
}

export {
  conseguirTodosLosReportes
};