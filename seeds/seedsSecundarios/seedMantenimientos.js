import conectarDB from "../../config/db.js";
import Mantenimiento from "../../models/equipo/Mantenimiento.js";
import Equipo from "../../models/equipo/Equipo.js";

const seedMantenimientos = async () => {
    try {
        await conectarDB();
        await Mantenimiento.deleteMany(); // Limpia la colección

        const equipos =  await Equipo.find();

        const getIdByName = (array, nombre) => {
            const obj = array.find(item => item.nombre === nombre);
            return obj ? obj._id : null;
        };

        const mantenimientos = [
            {
                equipo: "Microscopio Digital",
                fechaInicio: new Date("2025-04-07"),
                fechaFin: new Date("2025-04-09"),
                descripcion: "Mantenimiento preventivo de rutina",
                status: true
            },
            {
                equipo: "Centrífuga de Laboratorio",
                fechaInicio: new Date("2025-04-01"),
                fechaFin: new Date("2025-10-07"),
                descripcion: "Mantenimiento preventivo de rutina",
                status: true
            }
        ];

        for (const item of mantenimientos) {
            const nuevoMantenimiento = new Mantenimiento({
                fechaInicio: item.fechaInicio,
                fechaFin: item.fechaFin,
                descripcion: item.descripcion,
                status: item.status,
                idEquipo: getIdByName(equipos, item.equipo)
            });

            await nuevoMantenimiento.save();
        }

        console.log("Mantenimientos sembrados exitosamente");
    } catch (error) {
        console.error("Error al sembrar mantenimientos:", error);
        process.exit(1);
    }
}

export default seedMantenimientos;