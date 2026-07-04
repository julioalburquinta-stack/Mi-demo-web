// Importa mongoose para definir el esquema y modelo de MongoDB
import mongoose from "mongoose";

// Define el esquema para los videos
const videoSchema = new mongoose.Schema(
  {
    // Título del video (obligatorio)
    title: {
      type: String,
      required: true,
    },
    // Descripción del video (obligatoria)
    description: {
      type: String,
      required: true,
    },
    // Enlace del video (obligatorio)
    link: {
      type: String,
      required: true,
    },
    // Referencia al usuario que creó el video
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Relaciona con el modelo User
      required: true,
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
  }
);

// Exporta el modelo Video basado en el esquema definido
export default mongoose.model("Video", videoSchema);