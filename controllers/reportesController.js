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

async function crearGrafico(
    graficaEntradasSalidas,
    graficaCategoriasProductos
) {
    const width = 600;
    const height = 400;
    const chartCanvas  = new ChartJSNodeCanvas({ width, height });

    let config;

    if (graficaEntradasSalidas) {

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

    } else if (graficaCategoriasProductos) {

        // Codigo

    }

    return await chartCanvas.renderToBuffer(config);

}

async function crearTabla(
    listadoCompletoReactivos,
    // listadoProductosConDefectos,
    listaEntradasYSalidas
){

    let table;

    if (listadoCompletoReactivos){
        const reactivos = await Reactivo.find()
            .populate("idUnidadMedida")
            .populate("estadoFisico")
            .populate("idMarca")
            .populate("idGabinete");

        table = {
            title: '',
            headers: [],
            datas: [ /* complex data */ ],
            rows: [ /* or simple data */ ],
        };
    }

    return table;
}

const crearReporte = async (req, res) => {
    try {
        const {
            listadoCompletoReactivos,
            // listadoProductosConDefectos,
            listaEntradasYSalidas,
            graficaEntradasSalidas,
            graficaCategoriasProductos,
            // graficaPorcentajeReactivosDefectuosos,
            // graficaPorcentajeTiposDefectos,
            // graficaTendenciaDefectos,
        } = req.body;

        const doc = new PDFDocument();



        if (listadoCompletoReactivos) {

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el reporte" });
    }
}

export {
  conseguirTodosLosReportes
};