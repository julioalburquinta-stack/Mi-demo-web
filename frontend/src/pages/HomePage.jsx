import { useNavigate } from "react-router-dom"; // Hook para navegación programática
import { useFontSize } from "../context/FontSizeContext"; // Hook para obtener el tamaño de fuente desde el contexto
import Navbar from "../components/Navbar"; // Componente Navbar
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación para admin

function HomePage() {
  const navigate = useNavigate();
  const { fontSize } = useFontSize(); // Tamaño de fuente global
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  // Lista de botones base con colores y rutas
  const buttons = [
    { label: "Sobre Nosotros", path: "/about-us", bg: "#4A90E2", hover: "#357ABD" },
    { label: "Agenda de Eventos", path: "/events", bg: "#4A90E2", hover: "#357ABD" },
    { label: "Juego de Memoria", path: "/game", bg: "#4A90E2", hover: "#357ABD" },
    { label: "Beneficios Tercera Edad", path: "/benefits", bg: "#4A90E2", hover: "#357ABD" },
    { label: "Videos Rutinas de Ejercicios", path: "/videos", bg: "#4A90E2", hover: "#357ABD" },
    { label: "Guía de Nutrición", path: "/nutrition", bg: "#4A90E2", hover: "#357ABD" }, // ✅ Nuevo botón
  ];

  // Botón adicional solo para administradores
  if (isAdmin) {
    buttons.push({ label: "Usuarios Asist. Geri", path: "/users", bg: "#D9534F", hover: "#C9302C" });
  }

  return (
    <div
      className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Sección principal con grid de botones */}
      <div className="flex flex-col items-center justify-center flex-grow gap-10 px-4 sm:px-6 lg:px-10 py-12 pt-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={() => navigate(btn.path)}
              className="transform transition duration-300 font-semibold px-6 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-md text-white w-full"
              style={{
                backgroundColor: btn.bg,
                fontSize: `${fontSize * 0.9}px`, // Escala proporcional al fontSize global
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = btn.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = btn.bg)}
            >
              {btn.label}
            </button>
          ))}
        </div>
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

export default HomePage;