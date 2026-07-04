// Importa mongoose para manejar la conexión con MongoDB
import mongoose from "mongoose";

// Función asincrónica para conectar a la base de datos
export const connectDB = async () => {
    try {
        // Intenta conectarse a la base de datos MongoDB local llamada "merndb"
        await mongoose.connect("mongodb://localhost/merndb");

        // Muestra un mensaje en la consola si la conexión es exitosa
        console.log("MongoDB conectado");
    } catch (error) {
        // Muestra un mensaje en la consola si ocurre un error al conectar
        console.log(error);
    }
};