import mongoose from 'mongoose'; // Librería para interactuar con MongoDB

// Definición del esquema para almacenar tokens temporales (ej: recuperación de contraseña)
const tokenSchema = new mongoose.Schema({
  // ID del usuario al que pertenece el token
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Referencia al modelo User
    required: true, 
    ref: "User", // Relación con el esquema de usuarios
    unique: true // Cada usuario solo puede tener un token activo
  },
  // El token en sí (cadena aleatoria)
  token: { 
    type: String, 
    required: true 
  },
  // Fecha de creación del token con expiración automática
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 3600 // TTL index → el documento se elimina después de 1 hora (3600 seg)
  },
});

// Exportamos el modelo para usarlo en el sistema de autenticación
export default mongoose.model('Token', tokenSchema);