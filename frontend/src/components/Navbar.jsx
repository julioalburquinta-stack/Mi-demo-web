import { useState } from "react"; // Hook para manejar el estado local
import { useLocation, useNavigate } from "react-router-dom"; // Hooks de React Router para obtener la ruta actual y navegar
import { useAuth } from "../context/AuthContext"; // Contexto para manejar autenticación
import { useFontSize } from "../context/FontSizeContext"; // Contexto para cambiar tamaño de fuente

function Navbar({ hasUnsavedChanges = false, onLogout }) {
  const { isAuthenticated, logout, user } = useAuth(); // Estado de autenticación y funciones relacionadas
  const [isOpen, setIsOpen] = useState(false); // Estado para mostrar/ocultar menú en pantallas pequeñas
  const location = useLocation(); // Ruta actual
  const navigate = useNavigate(); // Función para redirigir a otra ruta

  const { increaseFont, decreaseFont } = useFontSize(); // Funciones para aumentar/disminuir el tamaño de letra

  // Verificamos si estamos en páginas específicas
  const isHomePage = location.pathname === "/";
  const isTaskFormPage =
    location.pathname === "/add-tasks" ||
    location.pathname.startsWith("/tasks/");
  const backLink = "/"; // Ruta de regreso (página principal)

  // Manejar navegación con confirmación si hay cambios sin guardar
  const handleNavigation = (path) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Tienes cambios sin guardar. Si continúas, se perderán."
      );
      if (!confirmLeave) return; // Cancelar navegación si no confirma
    }
    navigate(path);
  };

  // Manejar cierre de sesión
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Si se pasa una función externa, se ejecuta
      return;
    }

    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Tienes cambios sin guardar. Si continúas, se perderán."
      );
      if (!confirmLeave) return; // Cancelar logout si no confirma
    }

    logout(); // Función del contexto de autenticación
  };

  // Renderizar botones según estado de autenticación
  const renderButtons = () => (
    <>
      {/* Botones para cambiar tamaño de letra */}
      <li className="flex gap-2">
        <button
          onClick={decreaseFont}
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-md font-semibold"
        >
          A-
        </button>
        <button
          onClick={increaseFont}
          className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-md font-semibold"
        >
          A+
        </button>
      </li>

      {/* Opciones cuando el usuario está autenticado */}
      {isAuthenticated ? (
        <>
          <li className="text-[#2E3A46] text-lg font-semibold">
            Bienvenido {user.username}
          </li>

          {/* Botón "Volver" solo si no estamos en home o en el formulario de tareas */}
          {!isHomePage && !isTaskFormPage && (
            <li>
              <button
                onClick={() => handleNavigation(backLink)}
                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-md"
              >
                Volver
              </button>
            </li>
          )}

          {/* Botón para cerrar sesión */}
          <li>
            <button
              onClick={handleLogout}
              className="bg-[#D9534F] hover:bg-[#C9302C] text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-md"
            >
              Cerrar Sesión
            </button>
          </li>
        </>
      ) : (
        // Opciones cuando el usuario NO está autenticado
        <>
          <li>
            <button
              onClick={() => handleNavigation("/login")}
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-md"
            >
              Iniciar sesión
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/register")}
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-md"
            >
              Registrarse
            </button>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-[#F0F4F8] py-4 px-6 shadow-md mb-6 rounded-b-2xl border-b border-[#E1E5EA]">
      <div className="flex justify-between items-center">
        {/* Título de la aplicación */}
        <h1 className="text-3xl font-bold text-[#2E3A46]">Asistente Geri</h1>

        {/* Botón hamburguesa (solo en pantallas pequeñas) */}
        <button
          className="text-[#2E3A46] md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Icono cambia entre "X" (cerrar) y menú hamburguesa */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12" // X (cerrar menú)
                  : "M4 6h16M4 12h16M4 18h16" // Tres líneas (menú)
              }
            />
          </svg>
        </button>

        {/* Menú en pantallas grandes */}
        <ul className="hidden md:flex gap-4 items-center">{renderButtons()}</ul>
      </div>

      {/* Menú desplegable en pantallas pequeñas */}
      {isOpen && <ul className="flex flex-col gap-4 mt-4 md:hidden">{renderButtons()}</ul>}
    </nav>
  );
}

export default Navbar; // Exportamos el componente Navbar para usarlo en otros archivos