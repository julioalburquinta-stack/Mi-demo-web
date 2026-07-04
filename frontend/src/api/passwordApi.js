import axios from './axios'; // Importamos la instancia de axios configurada

// Función para enviar el enlace de restablecimiento de contraseña al correo del usuario
export const sendResetLink = (email) => axios.post('/password-reset', { email });

// Función para verificar si el token de restablecimiento es válido
export const verifyResetToken = (id, token) => axios.get(`/password-reset/${id}/${token}`);

// Función para restablecer la contraseña usando el id del usuario, el token y la nueva contraseña
export const resetPassword = (id, token, password) => axios.post(`/password-reset/${id}/${token}`, { password });