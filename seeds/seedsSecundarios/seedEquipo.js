import conectarDB from "../../config/db.js";
import Equipo from "../../models/equipo/Equipo.js";

const seedEquipos = async () => {
    try {
        await conectarDB();
        await Equipo.deleteMany(); // Limpia la colección

        const equipos = [
            {
                nombre: "Microscopio Digital",
                descripcion: "Microscopio con cámara integrada para análisis detallado",
                urlImagen: "https://example.com/images/microscopio.jpg",
                requiereMantenimiento: false,
                status: "Liberado"
            },
            {
                nombre: "Centrífuga de Laboratorio",
                descripcion: "Equipo para separación de componentes por densidad",
                urlImagen: "https://example.com/images/centrifuga.jpg",
                requiereMantenimiento: true,
                status: "Eliminado"
            },
            {
                nombre: "Autoclave Estéril",
                descripcion: "Esterilización a vapor de alta temperatura",
                urlImagen: "https://example.com/images/autoclave.jpg",
                requiereMantenimiento: true,
                status: "Liberado"
            },
            {
                nombre: "Analizador Bioquímico",
                descripcion: "Equipo automatizado para análisis de muestras sanguíneas",
                urlImagen: "https://example.com/images/analizador.jpg",
                requiereMantenimiento: false,
                status: "Liberado"
            },
            {
                nombre: "Incubadora CO2",
                descripcion: "Para cultivos celulares en ambiente controlado",
                urlImagen: "https://example.com/images/incubadora.jpg",
                requiereMantenimiento: true,
                status: "Liberado"
            }
        ];

        await Equipo.insertMany(equipos);
        console.log("Equipos sembrados exitosamente");
    } catch (error) {
        console.error("Error al sembrar equipos:", error);
        process.exit(1);
    }
}

export default seedEquipos;