import { createContext, useState, useContext, useEffect } from "react"; // Hooks y utilidades de React
import { registerRequest, LoginRequest, verifyTokenRequet } from '../api/auth'; // Importamos funciones para interactuar con la API

// Creamos el contexto de autenticación
export const AuthContext = createContext();

// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider"); // Aseguramos que se use dentro del proveedor
    }
    return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado del usuario logueado
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado si está autenticado o no
    const [errors, setErrors] = useState([]); // Errores de autenticación
    const [loading, setLoading] = useState(true); // Estado para controlar carga inicial

    // Registro de usuario
    const signup = async (userData) => {
        try {
            const res = await registerRequest(userData); // Enviamos datos a la API
            setUser(res.data); // Guardamos datos del usuario
            setIsAuthenticated(true); // Marcamos autenticación como activa
            localStorage.setItem("token", res.data.token); // Guardamos token en localStorage
            setErrors([]); // Limpiamos errores
        } catch (error) {
            // Manejo de errores con distintas respuestas posibles
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Base de datos desconectada"]);
            }
        }
    };

    // Inicio de sesión
    const signin = async (userData) => {
        try {
            const res = await LoginRequest(userData); // Llamada a la API
            setUser(res.data);
            setIsAuthenticated(true);
            localStorage.setItem("token", res.data.token); // Guardamos token en localStorage
            setErrors([]);
        } catch (error) {
            // Manejo detallado de errores con mensajes personalizados
            if (error.response) {
                const msg = error.response.data.message?.toLowerCase() || "";
                if (msg.includes("password") || msg.includes("contraseña")) {
                    setErrors(["Contraseña incorrecta"]);
                } else if (msg.includes("user") || msg.includes("usuario")) {
                    setErrors(["Usuario no encontrado"]);
                } else if (Array.isArray(error.response.data)) {
                    setErrors(error.response.data);
                } else {
                    setErrors([error.response.data.message || "Contraseña menor a 6 caracteres"]);
                }
            } else {
                setErrors(["Base de datos desconectada"]);
            }
        }
    };

    // Cerrar sesión
    const logout = () => {
        localStorage.removeItem("token"); // Eliminamos token guardado
        setIsAuthenticated(false); // Marcamos como no autenticado
        setUser(null); // Limpiamos usuario
    };

    // Limpiar errores automáticamente después de 5 segundos
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    // Verificar si hay un token almacenado al cargar la app
    useEffect(() => {
        const checkLogin = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await verifyTokenRequet(token); // Verificamos token en backend
                if (res.data) {
                    setUser(res.data); // Guardamos usuario (incluye roles o permisos)
                    setIsAuthenticated(true);
                } else {
                    logout(); // Si el token no es válido, cerramos sesión
                }
            } catch (error) {
                console.error("Error al verificar token:", error);
                logout();
                setErrors(["Base de datos desconectada"]);
            } finally {
                setLoading(false); // Marcamos que ya terminó de cargar
            }
        };

        checkLogin();
    }, []);

    // Mientras está cargando, no renderiza nada
    if (loading) return null;

    // Proveedor de contexto para usar en toda la app
    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors
        }}>
            {children} {/* Renderiza los componentes hijos */}
        </AuthContext.Provider>
    );
};