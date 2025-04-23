import conectarDB from "../../config/db.js";
import Reserva from "../../models/equipo/Reserva.js";
import Equipo from "../../models/equipo/Equipo.js";

const seedReserva = async () => {
    try {
        await conectarDB(); // Conectar a la base de datos
        await Reserva.deleteMany(); // Limpiar la colección
        const equipos = await Equipo.find();

        const getIdByName = (array, nombre) => {
            const obj = array.find(item => item.nombre === nombre);
            return obj ? obj._id : null;
        };

        const reservas = [
            {
                equipo: "Microscopio Digital",
                persona: "Diego",
                fechaInicio: new Date('2025-03-17'),
                fechaFin: new Date('2025-03-18'),
                status: true
            },
            {
                equipo: "Centrífuga de Laboratorio",
                persona: "Ana",
                fechaInicio: new Date('2025-03-19'),
                fechaFin: new Date('2025-03-21'),
                status: true
            },
            {
                equipo: "Autoclave Estéril",
                persona: "Carlos",
                fechaInicio: new Date('2025-03-22'),
                fechaFin: new Date('2025-03-24'),
                status: true
            },
            {
                equipo: "Analizador Bioquímico",
                persona: "Laura",
                fechaInicio: new Date('2025-03-25'),
                fechaFin: new Date('2025-03-27'),
                status: true
            },
            {
                equipo: "Incubadora CO2",
                persona: "Pedro",
                fechaInicio: new Date('2025-03-28'),
                fechaFin: new Date('2025-03-30'),
                status: true
            },
            {
                equipo: "Microscopio Digital",
                persona: "Sofía",
                fechaInicio: new Date('2025-03-31'),
                fechaFin: new Date('2025-04-02'),
                status: true
            },
            {
                equipo: "Centrífuga de Laboratorio",
                persona: "Juan",
                fechaInicio: new Date('2025-04-03'),
                fechaFin: new Date('2025-04-05'),
                status: true
            },
            {
                equipo: "Autoclave Estéril",
                persona: "Marta",
                fechaInicio: new Date('2025-04-06'),
                fechaFin: new Date('2025-04-08'),
                status: true
            },
            {
                equipo: "Analizador Bioquímico",
                persona: "Luis",
                fechaInicio: new Date('2025-04-09'),
                fechaFin: new Date('2025-04-11'),
                status: true
            },
            {
                equipo: "Incubadora CO2",
                persona: "Elena",
                fechaInicio: new Date('2025-04-12'),
                fechaFin: new Date('2025-04-14'),
                status: true
            },
            {
                equipo: "Microscopio Digital",
                persona: "Pablo",
                fechaInicio: new Date('2025-03-16'),
                fechaFin: new Date('2025-03-17'),
                status: true
            },
            {
                equipo: "Centrífuga de Laboratorio",
                persona: "Raquel",
                fechaInicio: new Date('2025-03-18'),
                fechaFin: new Date('2025-03-20'),
                status: true
            },
            {
                equipo: "Autoclave Estéril",
                persona: "Andrés",
                fechaInicio: new Date('2025-03-21'),
                fechaFin: new Date('2025-03-23'),
                status: true
            },
            {
                equipo: "Analizador Bioquímico",
                persona: "Clara",
                fechaInicio: new Date('2025-03-24'),
                fechaFin: new Date('2025-03-26'),
                status: true
            },
            {
                equipo: "Incubadora CO2",
                persona: "Jorge",
                fechaInicio: new Date('2025-03-27'),
                fechaFin: new Date('2025-03-29'),
                status: true
            }
        ];

        for (const item of reservas) {
            const nuevaReserva = new Reserva({
                idEquipo: getIdByName(equipos, item.equipo),
                persona: item.persona,
                fechaInicio: item.fechaInicio,
                fechaFin: item.fechaFin,
                status: item.status
            });

            await nuevaReserva.save();
        }

        console.log('Reservas sembradas exitosamente');
    } catch (error) {
        console.error('Error al sembrar la base de datos:', error.message);
        throw error;
    }
}

export default seedReserva;