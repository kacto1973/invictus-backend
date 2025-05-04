import EstadoFisico from '../models/reactivos/EstadoFisico.js';

const consultarEstadoFisico = async (req, res) => {
    try {
        const estadoFisico = await EstadoFisico.find({})
            .select('-__v')
            .lean();

        res.status(200).json(estadoFisico);
    } catch (error) {
        console.error('Error al consultar estado fisico:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export default consultarEstadoFisico;