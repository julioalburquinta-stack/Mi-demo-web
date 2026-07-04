// Importa la librería jsonwebtoken para crear y verificar tokens JWT
import jwt from 'jsonwebtoken';
// Importa la clave secreta desde la configuración
import { TOKEN_SECRET } from '../config.js';

// Función que crea un token de acceso con un payload determinado
export function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        // Genera un token JWT usando el payload y la clave secreta
        jwt.sign(
           payload,          // Datos que se almacenarán dentro del token
           TOKEN_SECRET,     // Clave secreta para firmar el token
           {
            expiresIn: "1d", // Duración del token: 1 día
           },
           (err, token) => { // Callback que maneja el resultado de la creación del token
             if (err) reject(err); // Rechaza la promesa si hay un error
             resolve(token);       // Resuelve la promesa con el token generado
           }
        );
    });
}