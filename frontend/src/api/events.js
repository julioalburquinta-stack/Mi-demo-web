import axios from './axios'; // Importamos la instancia de axios configurada

// Obtener todos los eventos
export const getEventsRequest = () => axios.get('/events');

// Obtener un evento por id
export const getEventRequest = (id) => axios.get(`/events/${id}`);

// Crear un nuevo evento
export const createEventRequest = (event) => axios.post('/events', event);

// Actualizar un evento
export const updateEventRequest = (id, event) => axios.put(`/events/${id}`, event);

// Eliminar un evento
export const deleteEventRequest = (id) => axios.delete(`/events/${id}`);