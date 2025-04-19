import Categoria from '../models/reactivos/Categoria.js';

const consultarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find({})
            .select('-__v -_id')
            .lean();

        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al consultar categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export default consultarCategorias;