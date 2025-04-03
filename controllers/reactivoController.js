import Reactivo from '../models/reactivos/Reactivo.js';

const consultarReactivos = async (req, res) => {
    try {
        // Aquí iría la lógica para consultar reactivos
        const reactivos = [];
        res.status(200).json(reactivos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los reactivos' });
    }
}

const crearReactivo = async (req, res) => {
    try {
        const reactivo = new Reactivo(req.body);        
        
        const reactivoGuardado = await reactivo.save();
        res.status(201).json({ message: 'Reactivo creado exitosamente', reactivo: reactivoGuardado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el reactivo' });
    }
}

export { 
    consultarReactivos,
    crearReactivo
};