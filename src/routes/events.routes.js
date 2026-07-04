import { Router } from "express"; // Importa el enrutador de Express
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para validar token de autenticación
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/events.controllers.js'; // Controladores de eventos

import { validateSchema } from '../middlewares/validator.middleware.js'; // Middleware para validar esquemas
import { createEventSchema } from "../schemas/event.schema.js"; // Esquema de validación para crear eventos

const router = Router(); // Inicializa el router de Express

// Rutas protegidas que requieren autenticación

// Obtener todos los eventos
router.get('/events', authRequired, getEvents);

// Obtener un evento específico por ID
router.get('/events/:id', authRequired, getEvent);

// Crear un nuevo evento con validación de esquema
router.post('/events', authRequired, validateSchema(createEventSchema), createEvent);

// Eliminar un evento por ID
router.delete('/events/:id', authRequired, deleteEvent);

// Actualizar un evento por ID
router.put('/events/:id', authRequired, updateEvent);

export default router; // Exporta el router para usarlo en la aplicación