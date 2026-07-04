import { Navigate, Outlet } from "react-router-dom"; // Importamos componentes de react-router-dom para manejar rutas
import { useAuth } from "./context/AuthContext"; // Importamos el hook personalizado de autenticación

function ProtectedRoute() {
    const {loading, isAuthenticated} = useAuth(); // Obtenemos el estado de carga y autenticación desde el contexto
    console.log(loading, isAuthenticated); // Mostramos en consola los valores de loading y autenticación

    if (loading) return <h1>Loading...</h1>; // Si aún está cargando, mostramos un mensaje de "Loading..."
    if (!loading && !isAuthenticated) return <Navigate to='login' replace/>; 
    // Si terminó de cargar y el usuario NO está autenticado, redirigimos a la página de login

    return <Outlet/>; // Si está autenticado, renderizamos las rutas hijas permitidas
}

export default ProtectedRoute; // Exportamos el componente para usarlo en otras partes de la app