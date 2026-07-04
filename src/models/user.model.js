// Importa mongoose para definir el esquema y modelo de MongoDB
import mongoose from "mongoose";

// Define el esquema para los usuarios
const userSchema = new mongoose.Schema({
    // Nombre de usuario (obligatorio y se eliminan espacios al inicio y fin)
    username: {
        type: String,
        required: true,
        trim: true
    },
    // Correo electrónico del usuario (obligatorio, único y sin espacios al inicio y fin)
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    // Contraseña del usuario (obligatoria)
    password: {
        type: String,
        required: true,
    },
    // Define si el usuario es administrador (por defecto false)
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Añade automáticamente campos createdAt y updatedAt
});

// Exporta el modelo User basado en el esquema definido
export default mongoose.model('User', userSchema);