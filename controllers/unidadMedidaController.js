import UnidadMedida from '../models/reactivos/UnidadMedida.js';

const consultarUnidadMedida = async (req, res) => {
    try {
        const unidadMedida = await UnidadMedida.find({})
            .select('-__v')
            .lean();

        res.status(200).json(unidadMedida);
    } catch (error) {
        console.error('Error al consultar unidades de medida:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export default consultarUnidadMedida;