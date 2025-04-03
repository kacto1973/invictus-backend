import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
            
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log("Error al conectar a la base de datos: ", error);
        process.exit(1); // Detener la app si hay un error
    }
}

export default conectarDB;