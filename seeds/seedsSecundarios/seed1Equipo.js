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
                urlImagen: "https://m.media-amazon.com/images/I/51eFrgkJHjL._AC_UF894,1000_QL80_.jpg",
                requiereMantenimiento: false,
                status: "Liberado"
            },
            {
                nombre: "Centrífuga de Laboratorio",
                descripcion: "Equipo para separación de componentes por densidad",
                urlImagen: "https://www.tplaboratorioquimico.com/wp-content/uploads/2015/03/centrifuga.jpg",
                requiereMantenimiento: true,
                status: "Eliminado"
            },
            {
                nombre: "Autoclave Estéril",
                descripcion: "Esterilización a vapor de alta temperatura",
                urlImagen: "https://tecnal.com.br/storage/blog_images/h8OmRuU4G01qPpIz908fd8hjqgUvIxEqwp1TOjel.png",
                requiereMantenimiento: true,
                status: "Liberado"
            },
            {
                nombre: "Analizador Bioquímico",
                descripcion: "Equipo automatizado para análisis de muestras sanguíneas",
                urlImagen: "https://catalogomedicomx.s3.amazonaws.com/produccion/img/p/3/3/2/9/1/33291-large_default.jpg",
                requiereMantenimiento: false,
                status: "Liberado"
            },
            {
                nombre: "Incubadora CO2",
                descripcion: "Para cultivos celulares en ambiente controlado",
                urlImagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJkO7hsNwXS9alTUoSzpl5ZMsKu-wcCXfpqg&s",
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