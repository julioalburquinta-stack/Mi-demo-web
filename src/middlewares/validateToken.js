// Importa jsonwebtoken para verificar tokens JWT
import jwt from 'jsonwebtoken';
// Importa la clave secreta desde la configuración
import {TOKEN_SECRET} from '../config.js';

// Middleware que verifica si el usuario está autenticado
export const authRequired = (req, res, next) => {
    // Obtiene el token de las cookies de la solicitud
    const { token } = req.cookies;

    // Si no hay token, devuelve un error 401 (No autorizado)
    if (!token) 
        return res.status(401).json({message: "No hay token, autorización denegada"});

    // Verifica que el token sea válido usando la clave secreta
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        // Si el token es inválido, devuelve un error 403 (Prohibido)
        if (err) return res.status(403).json({ message: "Token invalido "});

        // Agrega la información del usuario al objeto de la solicitud
        req.user = user;
        
        // Llama al siguiente middleware o ruta
        next();
    });
};