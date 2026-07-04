import { useEvents } from "../context/EventsContext"; // Importamos el hook personalizado que maneja el contexto de eventos
import { Link } from "react-router-dom"; // Importamos Link para la navegación interna en React Router
import dayjs from 'dayjs'; // Librería para manejar fechas
import utc from 'dayjs/plugin/utc'; // Plugin para manejar tiempos en formato UTC
dayjs.extend(utc); // Extendemos dayjs con el plugin de UTC

function EventCard({ event }) {
    const { deleteEvent } = useEvents(); // Obtenemos la función deleteEvent desde el contexto de eventos

    // Comparar fecha del evento con la fecha actual
    const eventDate = dayjs(event.dateEvent).utc(); // Convertimos la fecha del evento a UTC
    const today = dayjs().utc(); // Obtenemos la fecha actual en UTC
    const isPast = eventDate.isBefore(today, 'day'); // true si el evento ya pasó

    // Función para manejar la eliminación del evento
    const handleDelete = () => {
        const confirmed = window.confirm(
            "¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer."
        ); // Confirmación antes de eliminar
        if (confirmed) {
            deleteEvent(event._id); // Eliminamos el evento si el usuario confirma
        }
    };

    return (
        <div
            className={`relative p-6 rounded-2xl shadow-md flex flex-col justify-between ${
                isPast ? 'border-2 border-red-500 bg-[#FFE5E5]' : 'bg-[#E1E5EA]'
            }`} // Cambia estilo dependiendo si el evento ya pasó o no
            style={{ minHeight: '300px', maxHeight: '350px' }} // Definimos altura mínima y máxima
        >
            {/* Título del evento */}
            <h2 className="text-2xl font-bold mb-2 text-[#2E3A46]">{event.title}</h2>

            {/* Descripción del evento con scroll si es demasiado larga */}
            <div className="text-[#2E3A46] mb-2 flex-1 overflow-y-auto overflow-x-hidden break-words scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                {event.description}
            </div>

            {/* Fecha del evento */}
            <p className="text-[#6B7280] mb-2">
                {eventDate.format("DD/MM/YYYY")}
                {isPast && <span className="text-red-500 ml-2 font-semibold">(Ya puedes eliminar)</span>}
            </p>

            {/* Botones de acciones */}
            <div className="flex gap-4">
                {/* Botón para eliminar el evento */}
                <button
                    className="bg-[#D9534F] hover:bg-[#C9302C] transition-transform transform hover:scale-105 text-white font-semibold px-4 py-3 rounded-md shadow-md w-1/2 text-lg"
                    onClick={handleDelete}
                >
                    Eliminar
                </button>
                {/* Botón para ir a la página de edición del evento */}
                <Link
                    to={`/events/${event._id}`}
                    className="bg-[#4A90E2] hover:bg-[#357ABD] transition-transform transform hover:scale-105 text-white font-semibold px-4 py-3 rounded-md shadow-md w-1/2 text-center text-lg"
                >
                    Editar
                </Link>
            </div>
        </div>
    );
}

export default EventCard; // Exportamos el componente EventCard para usarlo en otras partes de la aplicación