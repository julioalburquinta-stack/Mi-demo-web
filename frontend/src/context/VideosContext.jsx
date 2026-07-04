import { createContext, useContext, useState } from "react"; // Hooks y utilidades de React
import { 
    createVideoRequest, 
    getVideosRequest, 
    getVideoRequest, 
    updateVideoRequest, 
    deleteVideoRequest 
} from "../api/videos"; // Funciones de la API de videos
import { useAuth } from "./AuthContext"; // Importamos el contexto de autenticación

const VideoContext = createContext(); // Creamos el contexto de videos

// Hook personalizado para usar el contexto de videos
export const useVideos = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error("useVideos must be used within a VideoProvider"); // Error si se usa fuera del proveedor
    }
    return context;
}

export function VideoProvider({ children }) {
    const [videos, setVideos] = useState([]); // Estado de la lista de videos
    const { user } = useAuth(); // Obtenemos el usuario actual
    const isAdmin = user?.email === "julioalburquinta@gmail.com"; // Verificamos si es administrador

    // Obtener todos los videos
    const getVideos = async () => {
        try {
            const res = await getVideosRequest();
            setVideos(res.data); // Guardamos los videos en el estado
        } catch (error) {
            console.error(error);
        }
    };

    // Crear un nuevo video (solo administrador)
    const createVideo = async (video) => {
        if (!isAdmin) return alert("Solo el administrador puede crear videos");
        try {
            const res = await createVideoRequest(video);
            setVideos((prev) => [...prev, res.data]); // Añadimos el nuevo video
        } catch (error) {
            console.error(error);
        }
    };

    // Eliminar un video (solo administrador)
    const deleteVideo = async (id) => {
        if (!isAdmin) return alert("Solo el administrador puede eliminar videos");
        try {
            const res = await deleteVideoRequest(id);
            if (res.status === 204) {
                setVideos((prevVideos) => prevVideos.filter((video) => video._id !== id)); // Filtramos el video eliminado
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Obtener un video específico por ID
    const getVideo = async (id) => {
        try {
            const res = await getVideoRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    // Actualizar un video (solo administrador)
    const updateVideo = async (id, video) => {
        if (!isAdmin) return alert("Solo el administrador puede editar videos");
        try {
            const res = await updateVideoRequest(id, video);
            setVideos((prevVideos) => prevVideos.map((v) => (v._id === id ? res.data : v))); // Actualizamos el video en el estado
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <VideoContext.Provider
            value={{
                videos, // Lista de videos
                createVideo, // Función para crear
                getVideos, // Función para obtener todos
                deleteVideo, // Función para eliminar
                getVideo, // Función para obtener uno
                updateVideo, // Función para actualizar
                isAdmin // Información sobre si el usuario es administrador
            }}
        >
            {children} {/* Renderizamos los hijos */}
        </VideoContext.Provider>
    );
}