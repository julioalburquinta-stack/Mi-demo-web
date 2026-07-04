// Middleware para validar el cuerpo de la solicitud usando un esquema (por ejemplo de Zod)
export const validateSchema = (schema) => (req, res, next) => {
    try {
        // Intenta validar req.body según el esquema proporcionado
        schema.parse(req.body);
        // Si la validación pasa, continúa con el siguiente middleware o ruta
        next();
    } catch (error) {
        // Si hay errores de validación, devuelve un estado 400 con los mensajes de error
        return res.status(400).json(
            error.errors.map((error) => error.message)
        );
    }
};