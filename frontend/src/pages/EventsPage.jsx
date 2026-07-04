import { useEffect, useState } from "react";
import { useEvents } from "../context/EventsContext";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { useFontSize } from "../context/FontSizeContext";
import Navbar from "../components/Navbar";
import agenda from "../manual/agenda.png"; // Imagen del manual

function EventsPage() {
  const { getEvents, events } = useEvents();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    getEvents();
  }, []);

  // ✅ Manual en pantalla completa
  if (showManual) {
    return (
      <div
        className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-y-auto bg-[#F9F6F1]"
        style={{ fontSize: `${fontSize}px` }}
      >
        {/* Navbar fija */}
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        {/* Contenido del manual */}
        <div className="flex-grow pt-28 pb-10 px-6 sm:px-10 max-w-6xl mx-auto text-center">
          <h2
            className="font-semibold mb-10 text-[#2E3A46]"
            style={{ fontSize: `${fontSize + 10}px` }}
          >
            Manual de Instrucciones
          </h2>

          <div
            className="text-left space-y-6 mb-12 leading-relaxed"
            style={{ fontSize: `${fontSize + 2}px`, lineHeight: "1.8" }}
          >
            <p>
              <strong>Paso 1:</strong> Para crear un evento, se presiona el botón{" "}
              <strong>"+ Añadir Evento"</strong>.
            </p>
            <p>
              <strong>Paso 2:</strong> Se llena el formulario, el título del evento, la
              descripción para otorgar detalles y se elige la fecha (en caso de no elegir
              una fecha, se programa para el mismo día).
            </p>
            <p>
              <strong>Paso 3:</strong> El nuevo evento es añadido a la agenda. Si la
              fecha caduca (los eventos que dicen <em>"ya puedes eliminar"</em>), se pueden
              reprogramar con el botón <strong>"editar"</strong> o eliminar con el botón{" "}
              <strong>"eliminar"</strong>.
            </p>
          </div>

          {/* Imagen más grande y clara */}
          <div className="flex justify-center mb-14">
            <img
              src={agenda}
              alt="Manual de Agenda"
              className="rounded-2xl shadow-lg w-full"
              style={{
                maxWidth: "1200px", // ✅ mucho más grande
                height: "auto",
              }}
            />
          </div>

          <button
            onClick={() => setShowManual(false)}
            className="bg-[#4A90E2] hover:bg-[#357ABD] transform hover:scale-105 transition duration-300 text-white font-semibold px-12 py-5 rounded-md shadow-md"
            style={{ fontSize: `${fontSize + 2}px` }}
          >
            Volver a la agenda
          </button>
        </div>
      </div>
    );
  }

  // ✅ Página normal de eventos
  return (
    <div
      className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden bg-[#F9F6F1]"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Navbar fija */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Contenedor principal */}
      <div className="flex-grow px-4 sm:px-6 lg:px-10 pt-28 pb-10">
        {/* Botón de instrucciones */}
        <div className="max-w-6xl mx-auto flex flex-col items-center mb-10">
          <button
            onClick={() => setShowManual(true)}
            className="bg-[#4A90E2] hover:bg-[#357ABD] transform hover:scale-105 transition duration-300 text-white font-semibold px-8 py-4 rounded-md shadow-md"
            style={{ fontSize: `${fontSize}px` }}
          >
            Instrucciones
          </button>
        </div>

        {/* Grid de eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 py-20 col-span-full">
              <h1 className="font-semibold" style={{ fontSize: `${fontSize + 4}px` }}>
                No hay eventos aún
              </h1>
              <button
                onClick={() => navigate("/add-events")}
                className="bg-[#4A90E2] hover:bg-[#357ABD] transform hover:scale-105 transition duration-300 text-white font-semibold px-6 py-4 rounded-md shadow-md w-full sm:w-auto"
                style={{ fontSize: `${fontSize}px`, minHeight: "100px", maxHeight: "150px" }}
              >
                + Añadir Evento
              </button>
            </div>
          ) : (
            <>
              {events.map((event) => (
                <EventCard event={event} key={event._id} />
              ))}

              {/* Card adicional para agregar nuevo evento */}
              <div
                onClick={() => navigate("/add-events")}
                className="flex items-center justify-center bg-[#E1E5EA] rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer p-6"
                style={{ fontSize: `${fontSize}px`, minHeight: "300px", maxHeight: "350px" }}
              >
                <span className="font-semibold text-center">+ Añadir Evento</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;