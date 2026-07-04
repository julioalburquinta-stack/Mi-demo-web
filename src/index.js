// Importa la instancia de la aplicación Express desde el archivo app.js
import app from './app.js';

// Importa la función para conectar a la base de datos desde db.js
import {connectDB} from './db.js';

// Llama a la función para establecer la conexión con la base de datos
connectDB();

// Inicia el servidor en el puerto 4000
app.listen(4000);

// Muestra un mensaje en la consola indicando que el servidor está corriendo
console.log('Servidor en el puerto', 4000);