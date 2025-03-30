/* 
Este archivo sirve para conectar el sistema a la base de datos.
Devuelve el objeto mongoose ya conectado a la base de datos.
*/

require('dotenv').config()
const mongoose = require('mongoose');

// Exporta mongoose inmediatamente
module.exports = mongoose;

// Función para conectar
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión a MongoDB establecida');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        process.exit(1); // Si no se conecta al mongo de una vez cierra el servidor
    }
};

// Intenta conectar
conectarDB();

