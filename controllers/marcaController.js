import Marca from '../models/reactivos/Marca.js';

const consultarMarcas = async (req, res) => {
    try {
        const marcas = await Marca.find({})
            .select('-__v')
            .lean();

        res.status(200).json(marcas);
    } catch (error) {
        console.error('Error al consultar marcas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export default consultarMarcas;