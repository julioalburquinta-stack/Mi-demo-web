import axios from './axios'; // Importamos la instancia de axios configurada

// Obtener todos los videos
export const getVideosRequest = () => axios.get('/videos');

// Obtener un video específico por su id
export const getVideoRequest = (id) => axios.get(`/videos/${id}`);

// Crear un nuevo video
export const createVideoRequest = (video) => axios.post('/videos', video);

// Actualizar un video existente por su id
export const updateVideoRequest = (id, video) => axios.put(`/videos/${id}`, video);

// Eliminar un video por su id
export const deleteVideoRequest = (id) => axios.delete(`/videos/${id}`);