// Importa Zod para validación de esquemas
import { z } from 'zod';

// Esquema de validación para crear un video
export const createVideoSchema = z.object({
    // Título del video (obligatorio)
    title: z.string({
        required_error: "El título es obligatorio"
    }),
    // Descripción del video (obligatoria)
    description: z.string({
        required_error: "La descripción es obligatoria"
    }),
    // Enlace del video (obligatorio y debe ser una URL válida)
    link: z.string({
        required_error: "El enlace es obligatorio"
    }).url("El enlace debe ser una URL válida")
});