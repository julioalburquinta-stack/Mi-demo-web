// Importa Router de Express para definir rutas
import { Router } from 'express';
// Importa los controladores de autenticación
import { 
    login, 
    register, 
    logout, 
    profile, 
    verifyToken 
} from '../controllers/auth.controllers.js';
// Importa middleware que verifica si el usuario está autenticado
import { authRequired } from '../middlewares/validateToken.js';
// Importa middleware para validar esquemas con Zod
import { validateSchema } from '../middlewares/validator.middleware.js';
// Importa los esquemas de validación para registro y login
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { getAllUsers } from '../controllers/auth.controllers.js';

// Crea una instancia de Router
const router = Router();

// Ruta para registrar un nuevo usuario con validación de esquema
router.post('/register', validateSchema(registerSchema), register);

// Ruta para iniciar sesión con validación de esquema
router.post('/login', validateSchema(loginSchema), login);

// Ruta para cerrar sesión
router.post('/logout', logout);

// Ruta para verificar si el token es válido
router.get('/verify', verifyToken);

// Ruta para obtener el perfil del usuario autenticado (requiere token)
router.get('/profile', authRequired, profile);

// Ruta para obtener todos los usuarios (requiere token y admin)
router.get('/users', authRequired, getAllUsers);

// Exporta las rutas de autenticación
export default router;