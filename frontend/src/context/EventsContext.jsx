import { createContext, useContext, useState } from "react"; // Hooks y utilidades de React
import { 
    createEventRequest, 
    getEventsRequest, 
    deleteEventRequest, 
    getEventRequest, 
    updateEventRequest 
} from "../api/events"; // Importa funciones para interactuar con la API de eventos

const EventContext = createContext(); // Crea el contexto para los eventos

// Hook personalizado para acceder al contexto de eventos
export const useEvents = () => {
    const context = useContext(EventContext); // Obtiene el contexto
    if (!context) throw new Error("useEvents must be used within an EventProvider"); // Error si se usa fuera del proveedor
    return context;
}

// Proveedor del contexto de eventos
export function EventProvider({ children }) {
    const [events, setEvents] = useState([]); // Estado para almacenar los eventos

    // Función para obtener todos los eventos desde la API
    const getEvents = async () => {
        try {
            const res = await getEventsRequest(); // Llamada a la API
            setEvents(res.data); // Actualiza el estado con los eventos obtenidos
        } catch (error) {
            console.error(error); // Manejo de errores
        }
    };

    // Función para crear un nuevo evento
    const createEvent = async (event) => {
        try {
            const res = await createEventRequest(event); // Llamada a la API para crear el evento
            setEvents(prev => [...prev, res.data]); // Agrega el nuevo evento al estado
        } catch (error) {
            console.error(error); // Manejo de errores
        }
    };

    // Función para eliminar un evento
    const deleteEvent = async (id) => {
        try {
            const res = await deleteEventRequest(id); // Llamada a la API para eliminar el evento
            if (res.status === 204) {
                setEvents(prev => prev.filter(e => e._id !== id)); // Filtra el evento eliminado del estado
            }
        } catch (error) {
            console.error(error); // Manejo de errores
        }
    };

    // Función para obtener un solo evento por ID
    const getEvent = async (id) => {
        try {
            const res = await getEventRequest(id); // Llamada a la API para obtener el evento
            return res.data; // Retorna los datos del evento
        } catch (error) {
            console.error(error); // Manejo de errores
        }
    };

    // Función para actualizar un evento
    const updateEvent = async (id, event) => {
        try {
            await updateEventRequest(id, event); // Llamada a la API para actualizar el evento
        } catch (error) {
            console.error(error); // Manejo de errores
        }
    };

    // Retorna el proveedor con todas las funciones y estado disponibles
    return (
        <EventContext.Provider value={{
            events,
            createEvent,
            getEvents,
            deleteEvent,
            getEvent,
            updateEvent
        }}>
            {children} {/* Renderiza los componentes hijos */}
        </EventContext.Provider>
    );
}