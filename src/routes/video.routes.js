// Importa Router de Express para definir rutas
import { Router } from 'express';
// Importa middleware que verifica si el usuario está autenticado
import { authRequired } from '../middlewares/validateToken.js';
// Importa middleware para validar esquemas con Zod
import { validateSchema } from '../middlewares/validator.middleware.js';
// Importa los controladores de videos
import { 
    createVideo, 
    getVideos, 
    getVideo, 
    updateVideo, 
    deleteVideo 
} from '../controllers/video.controllers.js';
// Importa el esquema de validación para crear videos
import { createVideoSchema } from '../schemas/video.schema.js';

// Crea una instancia de Router
const router = Router();

// Ruta para obtener todos los videos (requiere autenticación)
router.get('/videos', authRequired, getVideos);

// Ruta para obtener un video específico por ID (requiere autenticación)
router.get('/videos/:id', authRequired, getVideo);

// Ruta para crear un nuevo video (requiere autenticación y validación de esquema)
router.post('/videos', authRequired, validateSchema(createVideoSchema), createVideo);

// Ruta para actualizar un video por ID (requiere autenticación)
router.put('/videos/:id', authRequired, updateVideo);

// Ruta para eliminar un video por ID (requiere autenticación)
router.delete('/videos/:id', authRequired, deleteVideo);

// Exporta las rutas de videos
export default router;