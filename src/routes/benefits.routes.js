// Importa Router de Express para definir rutas
import { Router } from 'express';
// Importa middleware que verifica si el usuario está autenticado
import { authRequired } from '../middlewares/validateToken.js';
// Importa middleware para validar esquemas con Zod
import { validateSchema } from '../middlewares/validator.middleware.js';
// Importa los controladores de beneficios
import { 
    createBenefit, 
    getBenefits, 
    getBenefit, 
    updateBenefit, 
    deleteBenefit 
} from '../controllers/benefits.controllers.js';
// Importa el esquema de validación para crear beneficios
import { createBenefitSchema } from '../schemas/benefits.schema.js';

// Crea una instancia de Router
const router = Router();

// Ruta para obtener todos los beneficios (requiere autenticación)
router.get('/benefits', authRequired, getBenefits);

// Ruta para obtener un beneficio específico por ID (requiere autenticación)
router.get('/benefits/:id', authRequired, getBenefit);

// Ruta para crear un nuevo beneficio (requiere autenticación y validación de esquema)
router.post('/benefits', authRequired, validateSchema(createBenefitSchema), createBenefit);

// Ruta para actualizar un beneficio por ID (requiere autenticación)
router.put('/benefits/:id', authRequired, updateBenefit);

// Ruta para eliminar un beneficio por ID (requiere autenticación)
router.delete('/benefits/:id', authRequired, deleteBenefit);

// Exporta las rutas de beneficios
export default router;