import conectarDB from '../config/db.js';
import UnidadMedida from '../models/reactivos/UnidadMedida.js';

const seedUnidadMedida = async () => {
    try {
        await conectarDB(); // Conectar a la base de datos
        await UnidadMedida.deleteMany(); // Limpiar la colección

        // Datos de ejemplo
        const unidadesMedida = [
            { nombre: 'l' },
            { nombre: 'ml' },
            { nombre: 'kg' },
            { nombre: 'g' },
            { nombre: 'mg' },
        ];

        await UnidadMedida.insertMany(unidadesMedida); // Insertar los datos de ejemplo
        console.log('Unidades de medida sembradas exitosamente');
    } catch (error) {
        console.error('Error al sembrar la base de datos:', error.message);
        throw error;
    }
}

export default seedUnidadMedida;