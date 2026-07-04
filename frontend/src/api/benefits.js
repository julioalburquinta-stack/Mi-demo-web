import axios from './axios'; // Importamos la instancia de axios configurada

// Obtener todos los beneficios
export const getBenefitsRequest = () => axios.get('/benefits');

// Obtener un beneficio específico por su id
export const getBenefitRequest = (id) => axios.get(`/benefits/${id}`);

// Crear un nuevo beneficio
export const createBenefitRequest = (benefit) => axios.post('/benefits', benefit);

// Actualizar un beneficio existente por su id
export const updateBenefitRequest = (id, benefit) => axios.put(`/benefits/${id}`, benefit);

// Eliminar un beneficio por su id
export const deleteBenefitRequest = (id) => axios.delete(`/benefits/${id}`);