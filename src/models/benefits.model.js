// Importa mongoose para definir el esquema y modelo de MongoDB
import mongoose from "mongoose";

// Define el esquema para los beneficios
const benefitSchema = new mongoose.Schema(
  {
    // Título del beneficio (obligatorio)
    title: {
      type: String,
      required: true,
    },
    // Descripción del beneficio (obligatorio)
    description: {
      type: String,
      required: true,
    },
    // Enlace relacionado al beneficio (obligatorio)
    link: {
      type: String,
      required: true,
    },
    // Referencia al usuario que creó el beneficio
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Relaciona con el modelo User
      required: true,
    },
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

// Exporta el modelo de Benefit basado en el esquema definido
export default mongoose.model("Benefit", benefitSchema);