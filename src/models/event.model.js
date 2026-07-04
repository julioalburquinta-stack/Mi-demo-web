import mongoose from "mongoose"; // Importa Mongoose para definir esquemas y modelos

// Define el esquema para la colección de eventos
const eventSchema = new mongoose.Schema(
  {
    // Título del evento (obligatorio)
    title: {
      type: String,
      required: true,
    },
    // Descripción del evento (obligatoria)
    description: {
      type: String,
      required: true,
    },
    // Fecha del evento (por defecto la fecha actual si no se proporciona)
    dateEvent: { 
      type: Date,
      default: Date.now,
    },
    // Referencia al usuario que creó el evento (obligatorio)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo User
      required: true,
    }
  },
  {
    timestamps: true, // Agrega campos createdAt y updatedAt automáticamente
  }
);

// Exporta el modelo "Event" basado en el esquema definido
export default mongoose.model("Event", eventSchema);