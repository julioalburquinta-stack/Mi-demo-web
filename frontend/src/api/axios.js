import axios from 'axios'; // Importamos la librería axios

// Creamos una instancia de axios con configuración personalizada
const instance = axios.create({
    baseURL: 'http://localhost:4000/api', // URL base para todas las peticiones
    withCredentials: true // Incluye cookies y credenciales en las solicitudes
})

export default instance; // Exportamos la instancia para usarla en otros módulos