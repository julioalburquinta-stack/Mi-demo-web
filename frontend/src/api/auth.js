import axios from './axios'; // Importamos la instancia de axios configurada

// Función para registrar un nuevo usuario
export const registerRequest = (user) => axios.post(`/register`, user);

// Función para iniciar sesión con las credenciales del usuario
export const LoginRequest = (user) => axios.post(`/login`, user);

// Función para verificar la validez del token almacenado
export const verifyTokenRequet = () => axios.get('/verify');