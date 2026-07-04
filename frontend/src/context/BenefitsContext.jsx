import { createContext, useContext, useState } from "react"; // Hooks y utilidades de React
import { 
    createBenefitRequest, 
    getBenefitsRequest, 
    getBenefitRequest, 
    updateBenefitRequest, 
    deleteBenefitRequest 
} from "../api/benefits"; // Funciones de la API de beneficios
import { useAuth } from "./AuthContext"; // Importamos el contexto de autenticación

const BenefitsContext = createContext(); // Creamos el contexto de beneficios

// Hook personalizado para usar el contexto de beneficios
export const useBenefits = () => {
    const context = useContext(BenefitsContext);
    if (!context) {
        throw new Error("useBenefits must be used within a BenefitsProvider"); // Error si se usa fuera del proveedor
    }
    return context;
}

export function BenefitsProvider({ children }) {
    const [benefits, setBenefits] = useState([]); // Estado de la lista de beneficios
    const { user } = useAuth(); // Obtenemos el usuario actual
    const isAdmin = user?.email === "julioalburquinta@gmail.com"; // Verificamos si es administrador

    // Obtener todos los beneficios
    const getBenefits = async () => {
        try {
            const res = await getBenefitsRequest();
            setBenefits(res.data); // Guardamos los beneficios en el estado
        } catch (error) {
            console.error(error);
        }
    };

    // Crear un nuevo beneficio (solo administrador)
    const createBenefit = async (benefit) => {
        if (!isAdmin) return alert("Solo el administrador puede crear beneficios");
        try {
            const res = await createBenefitRequest(benefit);
            setBenefits((prev) => [...prev, res.data]); // Añadimos el nuevo beneficio
        } catch (error) {
            console.error(error);
        }
    };

    // Eliminar un beneficio (solo administrador)
    const deleteBenefit = async (id) => {
        if (!isAdmin) return alert("Solo el administrador puede eliminar beneficios");
        try {
            const res = await deleteBenefitRequest(id);
            if (res.status === 204) {
                setBenefits((prevBenefits) => prevBenefits.filter((b) => b._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Obtener un beneficio específico
    const getBenefit = async (id) => {
        try {
            const res = await getBenefitRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    // Actualizar un beneficio (solo administrador)
    const updateBenefit = async (id, benefit) => {
        if (!isAdmin) return alert("Solo el administrador puede editar beneficios");
        try {
            const res = await updateBenefitRequest(id, benefit);
            setBenefits((prevBenefits) => prevBenefits.map((b) => (b._id === id ? res.data : b)));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <BenefitsContext.Provider
            value={{
                benefits, // Lista de beneficios
                createBenefit, // Función para crear
                getBenefits, // Función para obtener todos
                deleteBenefit, // Función para eliminar
                getBenefit, // Función para obtener uno
                updateBenefit, // Función para actualizar
                isAdmin // Información sobre si el usuario es administrador
            }}
        >
            {children} {/* Renderizamos los hijos */}
        </BenefitsContext.Provider>
    );
}
