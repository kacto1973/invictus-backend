import MovimientoReactivo from "../models/movimientos/MovimientoReactivo.js";
import TipoMovimiento from "../models/movimientos/TipoMovimiento.js";
import Reactivo from "../models/reactivos/Reactivo.js";
import {supabase} from "../config/supabase.js";
import PDFDocument from "pdfkit-table"
import {ChartJSNodeCanvas} from 'chartjs-node-canvas';
import UnidadMedida from "../models/reactivos/UnidadMedida.js";
import Gabinete from "../models/reactivos/Gabinete.js";
import Marca from "../models/reactivos/Marca.js";
import EstadoFisico from "../models/reactivos/EstadoFisico.js";
import Equipo from "../models/equipo/Equipo.js";
import Mantenimiento from "../models/equipo/Mantenimiento.js";
import Reserva from "../models/equipo/Reserva.js";
import Categoria from "../models/reactivos/Categoria.js";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import Reporte from "../models/reportes/Reporte.js";
import EstadoReporte from "../models/reportes/EstadoReporte.js";
import { matchSorter } from "match-sorter";

dayjs.extend(isSameOrBefore);
dayjs.extend(utc)
dayjs.extend(timezone)

// Todos los imports inutilizados son necesarios para inicializar los esquemas de MongoDB

function cargarImports() { // No se utiliza, solo es para que no me borre los imports
    UnidadMedida;
    Gabinete;
    Marca;
    EstadoFisico;
    Categoria;
    TipoMovimiento;
}

const bucketName = "pdfs";

async function eliminarPDFSupa(nombre) {
    try {
        nombre = nombre.replace("%20", " ");

        const { data, error } = await supabase.storage
            .from(bucketName)
            .remove([`docs/${nombre}.pdf`]);

        if (error) {
            console.error('Error al eliminar el archivo:', error);
            return {error: error};
        }

        return data;
    } catch (error) {
        console.error("Error al eliminar el PDF:", error);
        return {error: error}
    }
}

const conseguirTodosLosReportes = async (req, res) => {
    /**
     * Obtiene todos los reportes de la base de datos.
     * @returns {JSON} - Lista de reportes.
     */
    try {
        const reportes = await Reporte.find()
            .sort({ fechaGeneracion: -1 })
            .populate("idEstadoReporte");
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

function insertarImagenConChequeo(doc, imageBuffers) {
    const margin = 50;
    const imageHeight = 300;
    const spacing = 50;

    const pageHeight = doc.page.height;

    let currentY = margin;

    imageBuffers.forEach((imgBuffer) => {
        if (currentY + imageHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
        }

        doc.image(imgBuffer, margin, currentY, {
            fit: [500, 320],
            align: 'center'
        });

        currentY += imageHeight + spacing;
    });
}

function generarColores(n) {
    const colores = [];
    for (let i = 0; i < n; i++) {
        const r = Math.floor(Math.random() * 156) + 100;
        const g = Math.floor(Math.random() * 156) + 100;
        const b = Math.floor(Math.random() * 156) + 100;
        colores.push(`rgb(${r}, ${g}, ${b})`);
    }
    return colores;
}

function calcularLineaTendencia(data) {
    const n = data.length;
    const sumX = data.reduce((acc, val, i) => acc + i, 0);
    const sumY = data.reduce((acc, val) => acc + val.y, 0);
    const sumXY = data.reduce((acc, val, i) => acc + i * val.y, 0);
    const sumXX = data.reduce((acc, val, i) => acc + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((val, i) => ({
        x: val.x,
        y: slope * i + intercept
    }));
}

function generarMensajeTendencia(inicio, tendencia, valorAlAzar){
    console.log(tendencia);
    if (Math.abs(tendencia) < 0.0005) {
        return `${inicio} se han mantenido en ${valorAlAzar.toFixed(4)}`;
    } else if (tendencia > 0) {
        return `${inicio} suben en promedio ${tendencia.toFixed(4)} al día`;
    } else {
        return `${inicio} bajan en promedio ${Math.abs(tendencia).toFixed(4)} al día`;
    }
}

async function crearGrafico(opcion) {
    // graficaCategoriasReactivos = 1
    // graficaEntradasSalidas     = 2
    // graficaReactivosAgotados   = 3
    // graficaUsodeEquipos        = 4
    // graficaServicioEquipos     = 5

    const width = 1100;
    const height = 704;
    const chartCanvas  = new ChartJSNodeCanvas({ width, height });

    switch (opcion) {
        case 1: {
            const reactivos = await Reactivo
                .find({status: true})
                .populate("idCategoria");

            const categorias = {};
            reactivos.forEach(r => {
                const nombre = r.idCategoria.nombre;
                categorias[nombre] = (categorias[nombre] || 0) + r.cantidad;
            });

            const labels = Object.keys(categorias);
            const data = Object.values(categorias);

            let total = 0;
            data.forEach(r => {
                total += r;
            })

            return await chartCanvas.renderToBuffer({
                type: 'pie',
                data: {
                    labels: labels.map((label, i) => `${label} (${data[i]}) (${Math.round((data[i] / total) * 10000) / 100}%)`),
                    datasets: [{
                        label: 'Distribución de Reactivos',
                        data,
                        backgroundColor: generarColores(data.length),
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Porcentaje de Reactivos por Categoría',
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
                        // tooltip: {
                        //     callbacks: {
                        //         label: function (context) {
                        //             const label = context.label.split('(')[0].trim();
                        //             const value = context.raw || 0;
                        //             const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        //             const porcentaje = ((value / total) * 100).toFixed(1);
                        //             return `${label} ${value} (${porcentaje}%)`;
                        //         }
                        //     }
                        // }
                    }
                }
            });
        }
        case 2: {
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);

            const movimientos = await MovimientoReactivo
                .find({ fecha: { $gte: hace30Dias } })
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

            const total = totalEntradas + totalSalidas;

            return await chartCanvas.renderToBuffer ({
                type: 'pie',
                data: {
                    labels: [
                        `Entradas (${totalEntradas}) (${Math.round((totalEntradas / total) * 10000) / 100}%)`,
                        `Salidas (${totalSalidas}) (${Math.round((totalSalidas / total) * 10000) / 100}%)`
                    ],
                    datasets: [{
                        label: 'Movimientos de Reactivos',
                        data: [totalEntradas, totalSalidas],
                        backgroundColor: generarColores(2),
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
                        // tooltip: {
                        //     callbacks: {
                        //         label: function (context) {
                        //             const label = context.label || '';
                        //             const value = context.raw || 0;
                        //             return `${label}: ${value}`;
                        //         }
                        //     }
                        // }
                    }
                }
            });
        }
        case 3: {
            const TotalReactivosAgotadosLista = await Reactivo.aggregate([
                { $match: { cantidad: 0, status: true } },
                { $count: "totalCantidad" }
            ]);

            const TotalReactivosLista = await Reactivo.aggregate([
                { $match: { status: true } }, { $count: "totalCantidad" }
            ]);

            const TotalReactivosAgotados = TotalReactivosAgotadosLista[0].totalCantidad;
            const TotalReactivos = TotalReactivosLista[0].totalCantidad - TotalReactivosAgotados;

            const total = TotalReactivosAgotados + TotalReactivos;

            return await chartCanvas.renderToBuffer({
                type: 'pie',
                data: {
                    labels: [
                        `Con Stock (${TotalReactivos}) (${Math.round((TotalReactivos / total) * 10000) / 100}%)`,
                        `Sin Stock (${TotalReactivosAgotados}) (${Math.round((TotalReactivosAgotados / total) * 10000) / 100}%)`
                    ],
                    datasets: [{
                        label: 'Reactivos',
                        data: [TotalReactivos, TotalReactivosAgotados],
                        backgroundColor: generarColores(2),
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Porcentaje de Reactivos Agotados',
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
                        // tooltip: {
                        //     callbacks: {
                        //         label: function (context) {
                        //             const label = context.label || '';
                        //             const value = context.raw || 0;
                        //             return `${label}: ${value}`;
                        //         }
                        //     }
                        // }
                    }
                }
            });
        }
        case 4: {
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);

            const reservas = await Reserva.find({
                $or: [
                    { fechaInicio: { $gte: hace30Dias } },
                    { fechaFin: { $gte: hace30Dias } }
                ]
            });

            const hoy = dayjs();
            const fechas = Array.from({ length: 30 }, (_, i) =>
                hoy.subtract(29 - i, 'day').format('YYYY-MM-DD')
            );

            const conteoPorFecha = fechas.reduce((acc, fecha) => {
                acc[fecha] = 0;
                return acc;
            }, {});

            reservas.forEach(reserva => {
                let inicio = dayjs(reserva.fechaInicio);
                const fin = dayjs(reserva.fechaFin);

                while (inicio.isSameOrBefore(fin)) {
                    const fechaStr = inicio.format('YYYY-MM-DD');
                    if (conteoPorFecha[fechaStr] !== undefined) {
                        conteoPorFecha[fechaStr]++;
                    }
                    inicio = inicio.add(1, 'day');
                }
            });

            const scatterData = fechas.map((fecha, i) => ({
                x: fecha,
                y: conteoPorFecha[fecha]
            }));

            const tendenciaData = calcularLineaTendencia(scatterData);

            const mensajeTendencia = generarMensajeTendencia("Las Reservas", (tendenciaData[tendenciaData.length - 1].y - tendenciaData[0].y) / 30, tendenciaData[0].y);

            return await chartCanvas.renderToBuffer({
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Reservas por Día (Puntos)',
                            data: scatterData,
                            backgroundColor: '#40C575',
                            showLine: false,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                        },
                        {
                            label: `Línea de Tendencia ( ${mensajeTendencia} )`,
                            data: tendenciaData,
                            borderColor: '#ff6961',
                            backgroundColor: 'transparent',
                            fill: false,
                            showLine: true,
                            pointRadius: 0,
                            tension: 0
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Tendencia de Reservas (últimos 30 días)',
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
                        // tooltip: {
                        //     callbacks: {
                        //         label: function (context) {
                        //             const label = context.dataset.label || '';
                        //             const value = context.raw.y || 0;
                        //             return `${label}: ${value.toFixed(2)}`;
                        //         }
                        //     }
                        // }
                    },
                    scales: {
                        x: {
                            type: 'category',
                            labels: fechas,
                            title: {
                                display: true,
                                text: 'Fecha'
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Cantidad de Reservas'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        case 5: {
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);

            const servicios = await Mantenimiento.find({
                $or: [
                    { fechaInicio: { $gte: hace30Dias } },
                    { fechaFin: { $gte: hace30Dias } }
                ]
            });

            const hoy = dayjs();
            const fechas = Array.from({ length: 30 }, (_, i) =>
                hoy.subtract(29 - i, 'day').format('YYYY-MM-DD')
            );

            const conteoPorFecha = fechas.reduce((acc, fecha) => {
                acc[fecha] = 0;
                return acc;
            }, {});

            servicios.forEach(servicio => {
                let inicio = dayjs(servicio.fechaInicio);
                const fin = dayjs(servicio.fechaFin);

                while (inicio.isSameOrBefore(fin)) {
                    const fechaStr = inicio.format('YYYY-MM-DD');
                    if (conteoPorFecha[fechaStr] !== undefined) {
                        conteoPorFecha[fechaStr]++;
                    }
                    inicio = inicio.add(1, 'day');
                }
            });

            const scatterData = fechas.map((fecha, i) => ({
                x: fecha,
                y: conteoPorFecha[fecha]
            }));

            const tendenciaData = calcularLineaTendencia(scatterData);

            const mensajeTendencia = generarMensajeTendencia("Los Servicios", (tendenciaData[tendenciaData.length - 1].y - tendenciaData[0].y) / 30, tendenciaData[0].y);

            return await chartCanvas.renderToBuffer({
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Servicios por Día (Puntos)',
                            data: scatterData,
                            backgroundColor: '#40C575',
                            showLine: false,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                        },
                        {
                            label: `Línea de Tendencia ( ${mensajeTendencia} )`,
                            data: tendenciaData,
                            borderColor: '#ff6961',
                            backgroundColor: 'transparent',
                            fill: false,
                            showLine: true,
                            pointRadius: 0,
                            tension: 0
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Tendencia de Servicios (últimos 30 días)',
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
                        // tooltip: {
                        //     callbacks: {
                        //         label: function (context) {
                        //             const label = context.dataset.label || '';
                        //             const value = context.raw.y || 0;
                        //             return `${label}: ${value.toFixed(2)}`;
                        //         }
                        //     }
                        // }
                    },
                    scales: {
                        x: {
                            type: 'category',
                            labels: fechas,
                            title: {
                                display: true,
                                text: 'Fecha'
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Cantidad de Servicios'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
}

async function todosLosPDFs() {
    const {data, error} = await supabase.storage
        .from(bucketName)
        .list('docs', {
            limit: 100,
            offset: 0,
            sortBy: {column: 'name', order: 'asc'}
        });

    if (error) {
        console.error('Error al listar archivos:', error);
        return {error: error};
    } else {
        return data;
    }
}

async function crearTabla(opcion){
    // listadoReactivos        = 1
    // listadoEntradasSalidas  = 2
    // listadoEquipos          = 3
    // listadoServicios        = 4
    // listadoUsos             = 5
    switch (opcion) {
        case 1: {
            const reactivos = await Reactivo.find({status: true})
                .populate("idUnidadMedida")
                .populate("estadoFisico")
                .populate("idMarca")
                .populate("idGabinete")
                .populate("idCategoria");

            let datos = [];

            reactivos.forEach(rea => {
                datos.push([
                    rea.nombre,
                    rea.idGabinete.nombre,
                    rea.idCategoria.nombre ?? "ND",
                    rea.idMarca.nombre,
                    rea.idUnidadMedida.nombre,
                    rea.estadoFisico.nombre,
                    rea.esPeligroso === true ? "Si" :
                        rea.esPeligroso === false ? "No" :
                            "ND",
                    rea.cantidad
                ]);
            })

            return {
                title: 'Lista completa de Reactivos',
                headers: [
                    "Nombre",
                    "Gabinete",
                    "Categoria",
                    "Marca",
                    "Unidad",
                    "Estado Fisico",
                    "¿Es Peligroso?",
                    "Cantidad"
                ],
                rows: datos,
                options: {
                    columnSpacing: 3,
                    padding: 3,
                }
            };
        }
        case 2: {
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);

            const movimientos = await MovimientoReactivo.find(
                { fecha: { $gte: hace30Dias } }
            )
                .populate("idReactivo")
                .populate("idTipoMovimiento")

            let datos = [];

            movimientos.forEach(mov => {
                datos.push([
                    mov.idTipoMovimiento.nombre,
                    mov.idReactivo.nombre,
                    mov.descripcion,
                    mov.cantidad,
                    mov.fecha.toLocaleDateString("es-ES",
                        { day: "numeric", month: "long", year: "numeric" })
                ]);
            })

            return {
                title: 'Lista de Movimientos en los Ultimos 30 dias',
                headers: [
                    "Tipo movimiento",
                    "Reactivo",
                    "Descripcion",
                    "Cantidad",
                    "Fecha"
                ],
                rows: datos,
                options: {
                    columnSpacing: 3,
                    padding: 3,
                }
            };
        }
        case 3: {
            const equipos = await Equipo.find()

            let datos = [];

            equipos.forEach(equ => {
                datos.push([
                    equ.nombre,
                    equ.descripcion,
                    equ.requiereMantenimiento === true ? "Si" :
                        equ.requiereMantenimiento === false ? "No" :
                            "ND"
                ]);
            })

            return {
                title: 'Lista Completa de Equipos',
                headers: [
                    "Nombre",
                    "Descripcion",
                    "¿Requiere Servicio?"
                ],
                rows: datos,
                options: {
                    columnSpacing: 3,
                    padding: 3,
                }
            };
        }
        case 4: {
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);

            const servicios = await Mantenimiento.find({
                $or: [
                    { fechaInicio: { $gte: hace30Dias } },
                    { fechaFin: { $gte: hace30Dias } }
                ]
            })
                .populate("idEquipo");

            let datos = [];

            servicios.forEach(ser => {
                datos.push([
                    ser.idEquipo.nombre,
                    ser.descripcion,
                    ser.fechaInicio.toLocaleDateString("es-ES",
                        { day: "numeric", month: "long", year: "numeric" }),
                    ser.fechaFin.toLocaleDateString("es-ES",
                        { day: "numeric", month: "long", year: "numeric" }),
                    ser.proximoMantenimiento ?? "ND",
                    ser.status === true ? "Vigente" :
                        ser.status === false ? "Vencido" :
                            "ND"
                ]);
            })

            return {
                title: 'Lista de Mantenimientos en los Ultimos 30 dias',
                headers: [
                    "Equipo Nombre",
                    "Descripcion",
                    "Fecha Inicio",
                    "Fecha Fin",
                    "Proximo Mantenimiento",
                    "Status"
                ],
                rows: datos,
                options: {
                    columnSpacing: 3,
                    padding: 3,
                }
            };
        }
        case 5: {
            const hace30Dias = new Date();
            hace30Dias.setDate(hace30Dias.getDate() - 30);

            const reservas = await Reserva.find({
                $or: [
                    { fechaInicio: { $gte: hace30Dias } },
                    { fechaFin: { $gte: hace30Dias } }
                ]
            })
                .populate("idEquipo");

            let datos = [];


            reservas.forEach(rev => {
                let vencido = rev.fechaFin >= new Date();

                datos.push([
                    rev.idEquipo.nombre,
                    rev.persona,
                    rev.fechaInicio.toLocaleDateString("es-ES",
                        { day: "numeric", month: "long", year: "numeric" }),
                    rev.fechaFin.toLocaleDateString("es-ES",
                        { day: "numeric", month: "long", year: "numeric" }),
                    rev.fechaAplazamiento ?? "ND",
                    vencido === true ? "Vigente" :
                        vencido === false ? "Vencido" :
                            "ND"
                ]);
            })

            return {
                title: 'Lista de Reservas en los Ultimos 30 dias',
                headers: [
                    "Equipo Nombre",
                    "Persona",
                    "Fecha Inicio",
                    "Fecha Fin",
                    "Fecha Aplazamiento",
                    "Status"
                ],
                rows: datos,
                options: {
                    columnSpacing: 3,
                    padding: 3,
                }
            };
        }
    }
}

async function generarNombreUnico() {

    const reportesSupa = await todosLosPDFs();

    if (reportesSupa.error) {
        console.error(reportesSupa.error);
        return null;
    }

    const nombresSinExtension = reportesSupa
        .filter(file => file.name.toLowerCase().endsWith('.pdf'))
        .map(file => file.name.replace(/\.pdf$/i, ''));

    let nombreBase = new Date().toISOString().slice(0, 10);
    let nombreFinal = nombreBase;
    let contador = 1;

    while (nombresSinExtension.includes(nombreFinal)) {
        nombreFinal = `${nombreBase} (${contador})`;
        contador++;
    }

    return nombreFinal;
}

async function crearEntradaReporte(nombre, url, tipo, id){
    try {
        const reportes =  await EstadoReporte.find();

        const getIdByName = (array, nombre) => {
            const obj = array.find(item => item.nombre === nombre);
            return obj ? obj._id : null;
        };

        if (!id) {
            return await Reporte.create({
                idEstadoReporte: getIdByName(reportes, tipo),
                nombre: nombre,
                fechaGeneracion: dayjs().tz('America/Hermosillo').toDate(), // Se guarda en UTC -7.
                urlReporte: url,
                status: true
            });
        } else {
            const reporte = await Reporte.findByIdAndUpdate(id,{
                urlReporte: url,
                idEstadoReporte: getIdByName(reportes, tipo)
            });

            if (!reporte) {
                return {error: "No se pudo actualizar el reporte"};
            }

            return {Exito: "Exito"};
        }

    } catch (error) {
        console.error("Error al crear la entrada del reporte:", error);
        return {error: error}
    }
}

const crearReporte = async (req, res) => {
    /**
     * Genera un reporte en PDF según las opciones proporcionadas, lo sube a Supebase y hace una entrada en MongoDB.
     * @param {Boolean} req.body.listadoReactivos - Listado completo de reactivos
     * @param {Boolean} req.body.listadoEntradasSalidas - Listado de entradas y salidas en los ultimos 30 días
     * @param {Boolean} req.body.listadoEquipos - Listado completo de equipos de laboratorio
     * @param {Boolean} req.body.listadoServicios - Listado de servicios a equipos en los ultimos 30 días
     * @param {Boolean} req.body.listadoUsos - Listado de uso de equipos en los ultimos 30 días
     * @param {Boolean} req.body.graficaCategoriasReactivos - Gráfica de porcentaje de reactivos por categoria
     * @param {Boolean} req.body.graficaEntradasSalidas - Gráfica de entradas vs salidas de los ultimos 30 días
     * @param {Boolean} req.body.graficaReactivosAgotados - Gráfica de porcentaje de reactivos agotados
     * @param {Boolean} req.body.graficaUsodeEquipos - Gráfica de tendencia de uso de equipo en los ultimos 30 días
     * @param {Boolean} req.body.graficaServicioEquipos - Gráfica de tendencia de servicio de equipo en los ultimos 30 días
     * @returns {JSON} - URL del PDF generado.
     */

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

        if (!listadoReactivos && !listadoEntradasSalidas && !listadoEquipos &&
            !listadoServicios && !listadoUsos && !graficaCategoriasReactivos &&
            !graficaEntradasSalidas && !graficaReactivosAgotados &&
            !graficaUsodeEquipos && !graficaServicioEquipos) {
            res.status(400).json({ error: "Error en la seleccion de opciones del reporte." });
            return;
        }

        const nombrePDF = await generarNombreUnico();

        if (!nombrePDF) {
            res.status(500).json({ error: "Error al generar el nombre del PDF" });
            return;
        }

        const idReporte = await crearEntradaReporte("Reporte " + nombrePDF, "No hay url todavia :c", "En proceso");

        const doc = new PDFDocument({
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const logoPath = './assets/DICTUS-logo.png';

        const insertarLogo = () => {
            const logoWidth = 50;
            const logoHeight = 40;
            const x = doc.page.width - logoWidth - 20;
            const y = 20;

            doc.image(logoPath, x, y, { width: logoWidth, height: logoHeight });
        };

        insertarLogo();
        doc.on('pageAdded', insertarLogo);

        let tablas = [];
        let huboPaginaAnterior = false;
        if (listadoReactivos || listadoEntradasSalidas || listadoEquipos || listadoServicios || listadoUsos) {
            if (listadoReactivos) tablas.push(await crearTabla(1));
            if (listadoEntradasSalidas) tablas.push(await crearTabla(2));
            if (listadoEquipos) tablas.push(await crearTabla(3));
            if (listadoServicios) tablas.push(await crearTabla(4));
            if (listadoUsos) tablas.push(await crearTabla(5));

            for (const data of tablas) {
                await insertarTablaConChequeo(doc, data);
                doc.moveDown();
            }

            huboPaginaAnterior = true;
        }



        let imagenes = [];
        if (graficaCategoriasReactivos || graficaEntradasSalidas || graficaReactivosAgotados || graficaUsodeEquipos || graficaServicioEquipos) {

            if (huboPaginaAnterior) doc.addPage();

            if (graficaCategoriasReactivos) imagenes.push(await crearGrafico(1));
            if (graficaEntradasSalidas) imagenes.push(await crearGrafico(2));
            if (graficaReactivosAgotados) imagenes.push(await crearGrafico(3));
            if (graficaUsodeEquipos) imagenes.push(await crearGrafico(4));
            if (graficaServicioEquipos) imagenes.push(await crearGrafico(5));

            insertarImagenConChequeo(doc, imagenes);
        }

        doc.end();

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(`docs/${nombrePDF}.pdf`, doc, {
                contentType: 'application/pdf',
                upsert: false,
                duplex: "half"
            });

        if (error) {
            console.error('❌ Error al subir:', error);
            await crearEntradaReporte(nombrePDF, "No hay url todavia :c", "Error", idReporte._id)
            res.status(500).json(
                { error: "Error al subir el PDF" }
            );
            return;
        }

        const { data: publicUrlData } = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(data.path);

        const url = publicUrlData.publicUrl;

        if (!url) {
            console.error('❌ Error al obtener la URL pública:', error);
            await crearEntradaReporte(nombrePDF, "No hay url todavia :c", "Error", idReporte._id)
            res.status(500).json({ error: "Error al obtener la URL pública" });
            return;
        }

        const verificacionEntrada = await crearEntradaReporte(nombrePDF, url, "Completado", idReporte._id);

        if (verificacionEntrada.error) {
            console.error("Error al crear la entrada del reporte:", error);
            const verificacionEliminar = await eliminarPDFSupa(nombrePDF);

            if (verificacionEliminar.error) {
                console.error("Error al eliminar el PDF:", verificacionEliminar.error);
                res.status(500).json({ error: "Error al crear la entrada del reporte y al eliminar el PDF" });
                return;

            }
            res.status(500).json({ error: "Error al crear la entrada del reporte" });
            return;
        }

        console.log('✅ PDF subido:', data);
        res.status(200).json({
            message: "PDF creado y subido exitosamente",
            url: url
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el reporte" });
    }
}

const eliminarReporte = async (req, res) => {
    /**
     * Elimina un reporte de la base de datos y del almacenamiento.
     * @param {String} req.body.id - ID del reporte a eliminar.
     * @returns {JSON} - Mensaje de éxito o error.
     */
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ error: "ID del reporte es requerido" });
            return;
        }

        const reporte = await Reporte.findById(id);

        if (!reporte) {
            return res.status(404).json({ error: "Reporte no encontrado" });
        }

        const fileName = reporte.urlReporte.split('/').pop().replace('.pdf', '');

        const verificacionSupa = await eliminarPDFSupa(fileName);
        await Reporte.findByIdAndDelete(id);

        if (verificacionSupa.error) {
            console.error("Error al eliminar el PDF:", verificacionSupa.error);
            res.status(500).json({ error: "Error al eliminar el PDF" });
            return;
        }

        console.log("Archivo PDF elimado:", fileName);
        res.status(200).json({ message: "Reporte eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el reporte" });
    }
}

const cambiarNombreReporte = async (req, res) => {
    /**
     * Cambia el nombre de un reporte en la base de datos.
     * @param {String} req.body.id - ID del reporte a modificar.
     * @param {String} req.body.nombre - Nuevo nombre del reporte.
     * @returns {JSON} - Mensaje de éxito o error.
     */
    try {
        const { id, nombre } = req.body;

        if (!id || !nombre) {
            res.status(400).json({ error: "ID y nombre son requeridos" });
            return;
        }

        const reporte = await Reporte.findByIdAndUpdate(id, { nombre });

        if (!reporte) {
            return res.status(404).json({ error: "Reporte no encontrado" });
        }

        res.status(200).json({ message: "Nombre del reporte actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al cambiar el nombre del reporte" });
    }
}

const conseguirReportesPorNombre = async (req, res) => {
    /**
     * Obtiene un reporte por su nombre.
     * @param {String} req.body.nombre - Nombre del reporte a buscar.
     * @returns {JSON} - Reportes encontrados que coinciden con el nombre, o un error.
     */
    try {
        const { nombre } = req.body;

        if (!nombre) {
            res.status(400).json({ error: "Nombre del reporte es requerido" });
            return;
        }

        const reportes = await Reporte.find();

        if (!reportes || reportes.length === 0) {
            return res.status(404).json({ error: "Reportes no encontrados" });
        }

        const reportesEncontrados = matchSorter(reportes, nombre.toLowerCase(), {
            keys: [item => item.nombre.toLowerCase()]
        });

        res.status(200).json(reportesEncontrados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el reporte" });
    }
}

const conseguirReportesPorRangoDeFechas = async (req, res) => {
    /**
     * Obtiene reportes por un rango de fechas.
     * @param {String} req.body.fechaInicio - Fecha de inicio del rango.
     * @param {String} req.body.fechaFin - Fecha de fin del rango.
     * @returns {JSON} - Reportes encontrados dentro del rango de fechas, o un error.
     */
    try {
        const { fechaInicio, fechaFin } = req.body;

        if (!fechaInicio || !fechaFin) {
            res.status(400).json({ error: "Fechas son requeridas" });
            return;
        }

        const fechaInicioDate = dayjs.tz(fechaInicio, 'America/Hermosillo').startOf('day').toDate();
        const fechaFinDate = dayjs.tz(fechaFin, 'America/Hermosillo').endOf('day').toDate();

        if (!fechaInicioDate || !fechaFinDate || isNaN(fechaInicioDate) || isNaN(fechaFinDate)) {
            res.status(400).json({ error: "Fechas inválidas" });
            return;
        }

        if (fechaInicioDate > fechaFinDate) {
            res.status(400).json({ error: "La fecha de inicio no puede ser mayor que la fecha de fin" });
            return;
        }

        const reportes = await Reporte.find({
            fechaGeneracion: {
                $gte: fechaInicioDate,
                $lte: fechaFinDate
            }
        });

        res.status(200).json(reportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los reportes" });
    }
}

export {
    conseguirTodosLosReportes,
    crearReporte,
    eliminarReporte,
    cambiarNombreReporte,
    conseguirReportesPorNombre,
    conseguirReportesPorRangoDeFechas
};