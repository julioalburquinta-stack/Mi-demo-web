import accesibilidadImg from "../valores/accesibilidad.png"; // Imagen de accesibilidad
import respetoImg from "../valores/respeto.png"; // Imagen de respeto
import inclusionImg from "../valores/inclusion.png"; // Imagen de inclusión
import { useFontSize } from "../context/FontSizeContext"; // Hook para tamaño de fuente
import Navbar from "../components/Navbar"; // Componente Navbar

function AboutUsPage() {
  const { fontSize } = useFontSize(); // Obtenemos el tamaño de fuente

  return (
    <div
      className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden"
      style={{ fontSize: `${fontSize}px` }} // Control dinámico del tamaño
    >
      {/* Navbar fijo arriba */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow px-4 sm:px-6 lg:px-10 py-12 pt-28">
        {/* Sección de bienvenida y quienes somos */}
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          <div className="bg-[#E1E5EA] p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h1 className="font-bold mb-4 text-[#4A90E2] leading-snug">
              ¡Bienvenidos a Asistente Geri!
            </h1>
            <p className="leading-relaxed">
              Tu apoyo digital para un envejecimiento activo, fácil y seguro.
              Aquí encontrarás información útil, actividades y recursos
              diseñados especialmente para ti.
            </p>
          </div>

          <div className="bg-[#E1E5EA] p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h2 className="font-bold mb-4 text-[#4A90E2] leading-snug">
              Quiénes somos
            </h2>
            <p className="leading-relaxed">
              Somos un equipo dedicado a crear herramientas digitales que
              faciliten la vida de los adultos mayores y sus cuidadores.
              Buscamos promover la inclusión, el bienestar y la autonomía a
              través de tecnología accesible y amigable.
            </p>
          </div>
        </main>

        {/* Sección de valores */}
        <section className="max-w-6xl mx-auto text-center">
          <h2 className="font-bold mb-10 text-[#4A90E2] leading-snug">
            Nuestros valores
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            <div className="bg-[#E1E5EA] p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col items-center">
              <img
                src={accesibilidadImg}
                alt="Accesibilidad"
                className="w-16 h-16 sm:w-20 sm:h-20 mb-4 object-contain"
              />
              <p className="font-semibold">Accesibilidad</p>
            </div>

            <div className="bg-[#E1E5EA] p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col items-center">
              <img
                src={respetoImg}
                alt="Respeto"
                className="w-16 h-16 sm:w-20 sm:h-20 mb-4 object-contain"
              />
              <p className="font-semibold">Respeto</p>
            </div>

            <div className="bg-[#E1E5EA] p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col items-center">
              <img
                src={inclusionImg}
                alt="Inclusión"
                className="w-16 h-16 sm:w-20 sm:h-20 mb-4 object-contain"
              />
              <p className="font-semibold">Inclusión</p>
            </div>
          </div>

          {/* Cuadro de información sobre ajuste de letra con título "Aviso" */}
          <div className="bg-[#E1E5EA] p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col items-center mt-8">
            <h3 className="font-bold mb-2 text-[#4A90E2]">Aviso</h3>
            <p className="font-semibold text-center">
              Si tienes dificultad para leer, puedes agrandar o achicar el tamaño de la letra usando los botones <span className="font-bold">+A</span> y <span className="font-bold">-A</span>.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#E1E5EA] w-full text-center py-8 mt-20 rounded-t-xl shadow-inner px-4 sm:px-0">
        <p className="leading-relaxed">
          <span className="text-[#4A90E2] font-semibold">
            Asistente Geri © 2025 - Todos los Derechos Reservados
          </span>
          <br />
          <br />
        </p>
      </footer>
    </div>
  );
}

export default AboutUsPage;