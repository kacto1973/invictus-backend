import Gabinete from '../models/reactivos/Gabinete.js';

const consultarGabinetes = async (req, res) => {
    try {
        const gabinetes = await Gabinete.find({})
            .select('-__v -descripcion -status')
            .where('status', true)
            .lean();

        res.status(200).json(gabinetes);
    } catch (error) {
        console.error('Error al consultar gabinetes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export default consultarGabinetes;
