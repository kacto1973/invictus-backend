import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const runSeeds = async () => {
    const seedsDir = path.resolve('seeds'); // Ruta a la carpeta de seeds

    try {
        // Leer todos los archivos de la carpeta seeds
        const seedFiles = fs.readdirSync(seedsDir).filter(file => file.endsWith('.js'));
        console.log(`Encontrados ${seedFiles.length} archivos de seeds.`);

        for (const file of seedFiles) {
            console.log(`Ejecutando seed: ${file}`);
            const seedFilePath = path.join(seedsDir, file);

            // Importar y ejecutar cada archivo de seed
            const seedModule = await import(`file://${seedFilePath}`);
            const seedFunction = seedModule.default; // Acceder a la función exportada por defecto
            await seedFunction();
        }

        console.log('Todos los seeds se han ejecutado correctamente.');
        process.exit(0); // Salir del proceso sin errores
    } catch (error) {
        console.error('Error al ejecutar los seeds:', error.message);
        process.exit(1); // Salir del proceso con errores
    }
}

runSeeds();