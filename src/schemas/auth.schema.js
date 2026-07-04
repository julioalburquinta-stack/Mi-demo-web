// Importa Zod para validación de esquemas
import { z } from "zod";

// Esquema de validación para el registro de usuario
export const registerSchema = z.object({
  // Nombre de usuario (obligatorio)
  username: z.string({
    required_error: "El nombre de usuario es obligatorio",
  }),
  // Correo electrónico (obligatorio y debe ser válido)
  email: z
    .string({
      required_error: "El correo electrónico es obligatorio",
    })
    .email({
      message: "El correo electrónico no es válido",
    }),
  // Contraseña (obligatoria, mínimo 6 caracteres)
  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
});

// Esquema de validación para login de usuario
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});