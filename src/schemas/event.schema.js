import { z } from 'zod'; // Importa Zod para validación de esquemas

// Esquema de validación para crear un evento
export const createEventSchema = z.object({
  // El título es obligatorio
  title: z.string({
    required_error: "El título es obligatorio"
  }),
  // La descripción es obligatoria
  description: z.string({
    required_error: "La descripción es obligatoria"
  }),
  // La fecha del evento es opcional, pero si se proporciona debe ser una cadena de fecha válida
  dateEvent: z.string().datetime().optional(), 
});