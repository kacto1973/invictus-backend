import conectarDB from "../../config/db.js";
import MovimientoReactivo from "../../models/movimientos/MovimientoReactivo.js";
import Reactivo from "../../models/reactivos/Reactivo.js";
import TipoMovimiento from "../../models/movimientos/TipoMovimiento.js";

const seedMovimientos = async () => {
    try {
        await conectarDB();
        await MovimientoReactivo.deleteMany(); // Limpiar la colección

        const reactivos = await Reactivo.find();
        const tiposMovimiento = await TipoMovimiento.find();

        const getIdByName = (array, nombre, descripcion) => {
            const obj = array.find(item => item.nombre === nombre);
            if (descripcion) {
                console.log("Buscando objeto:", nombre, "con descripcion:", descripcion, "su id es:", obj._id)
            }
            return obj._id;
        };

        const movimientos = [
            {
                reactivo: "Ácido Clorhídrico",
                tipo: "Entrada",
                descripcion: "Restock inicial",
                cantidad: 500,
            },
            {
                reactivo: "Etanol",
                tipo: "Salida",
                descripcion: "Uso en experimento de extracción",
                cantidad: 200,
                fecha: new Date('2024-02-01')
            },
            {
                reactivo: "Sulfato de Cobre",
                tipo: "Entrada",
                descripcion: "Compra de nuevo lote",
                cantidad: 100,
                fecha: new Date('2024-02-10')
            },
            {
                reactivo: "Nitrato de Plata",
                tipo: "Salida",
                descripcion: "Preparación de soluciones estándar",
                cantidad: 50,
                fecha: new Date('2024-03-05')
            },
            {
                reactivo: "Fosfato de Calcio",
                tipo: "Entrada",
                descripcion: "Donación de otro laboratorio",
                cantidad: 150,
                fecha: new Date('2024-03-12')
            },
            {
                reactivo: "Acetona",
                tipo: "Salida",
                descripcion: "Limpieza de equipos",
                cantidad: 300,
                fecha: new Date('2024-04-01')
            },
            {
                reactivo: "Cloruro de Sodio",
                tipo: "Entrada",
                descripcion: "Compra mensual",
                cantidad: 500,
                fecha: new Date('2024-04-15')
            },
            {
                reactivo: "Solución Salina",
                tipo: "Salida",
                descripcion: "Preparación de medios de cultivo",
                cantidad: 400,
                fecha: new Date('2024-05-02')
            },
            {
                reactivo: "Agar",
                tipo: "Entrada",
                descripcion: "Pedido especial",
                cantidad: 30,
                fecha: new Date('2024-05-10')
            },
            {
                reactivo: "Bicarbonato de Sodio",
                tipo: "Salida",
                descripcion: "Experimento de química básica",
                cantidad: 100,
                fecha: new Date('2024-05-20')
            }
        ];

        for (const item of movimientos) {
            // Nomas ando probando como se establece la fecha actual
            // Ya lo probe, se pone segun la hora de la UTC
            if (!item.fecha) {
                const reactivo = getIdByName(reactivos, item.reactivo, item.descripcion);

                const nuevoMovimiento = new MovimientoReactivo({
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    idReactivo: reactivo,
                    idTipoMovimiento: getIdByName(tiposMovimiento, item.tipo)
                });

                await nuevoMovimiento.save();
            } else {
                const reactivo = getIdByName(reactivos, item.reactivo, item.descripcion);

                const nuevoMovimiento = new MovimientoReactivo({
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    fecha: item.fecha,
                    idReactivo: reactivo,
                    idTipoMovimiento: getIdByName(tiposMovimiento, item.tipo)
                });

                await nuevoMovimiento.save();
            }
        }

        console.log("Movimientos sembrados exitosamente");

    } catch (error) {
        console.error("Error al sembrar movimientos:", error.message);
        throw error;
    }
}

export default seedMovimientos;