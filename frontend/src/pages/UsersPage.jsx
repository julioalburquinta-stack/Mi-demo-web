import { useEffect, useState, useMemo } from "react"; // Hooks de React
import { useNavigate } from "react-router-dom"; // Hook de navegación
import Fuse from "fuse.js"; // Búsqueda difusa
import Navbar from "../components/Navbar"; // Componente Navbar
import { useFontSize } from "../context/FontSizeContext"; // Contexto para tamaño de fuente
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación
import axios from "axios"; // Cliente HTTP

function UsersPage() {
    const { fontSize } = useFontSize(); // Tamaño de fuente global
    const { user } = useAuth(); // Usuario actual
    const navigate = useNavigate(); // Navegación

    // Estados locales
    const [users, setUsers] = useState([]); // Lista de usuarios
    const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
    const [loading, setLoading] = useState(true); // Indicador de carga
    const [isEditing, setIsEditing] = useState(false); // Modal de edición activo
    const [editingUser, setEditingUser] = useState(null); // Usuario que se está editando
    const [usernameInput, setUsernameInput] = useState(""); // Input de username en modal
    const [emailInput, setEmailInput] = useState(""); // Input de email en modal
    const [modalFontSize, setModalFontSize] = useState(fontSize); // Tamaño de fuente en modal

    // Cargar usuarios desde la API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!user?.isAdmin) { // Redirigir si no es admin
                    navigate("/"); 
                    return;
                }
                const res = await axios.get("http://localhost:4000/api/users", {
                    withCredentials: true,
                });
                setUsers(res.data); // Guardar usuarios
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            } finally {
                setLoading(false); // Finaliza carga
            }
        };
        fetchUsers();
    }, [user]);

    // Filtro difuso de usuarios por username y email
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;

        const fuse = new Fuse(users, {
            keys: ["username", "email"], // Campos a buscar
            threshold: 0.4, // Sensibilidad del fuzzy search
        });

        const results = fuse.search(searchTerm);
        return results.map(r => r.item); // Extraer usuarios filtrados
    }, [searchTerm, users]);

    // Evitar cerrar la ventana si hay cambios sin guardar
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (
                isEditing &&
                editingUser &&
                (usernameInput !== editingUser.username || emailInput !== editingUser.email)
            ) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isEditing, editingUser, usernameInput, emailInput]);

    // Eliminar usuario
    const handleDelete = async (userId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.")) return;
        try {
            await axios.delete(`http://localhost:4000/api/users/${userId}`, { withCredentials: true });
            setUsers(prev => prev.filter(u => u._id !== userId)); // Actualizar lista
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    // Abrir modal de edición
    const openEditModal = (user) => {
        setEditingUser(user);
        setUsernameInput(user.username);
        setEmailInput(user.email);
        setModalFontSize(fontSize); // Ajustar fuente
        setIsEditing(true);
    };

    // Cerrar modal de edición con confirmación si hay cambios
    const closeEditModal = () => {
        if (
            editingUser &&
            (usernameInput !== editingUser.username || emailInput !== editingUser.email)
        ) {
            const confirmExit = window.confirm("Hay cambios sin guardar. ¿Deseas salir y perder los cambios?");
            if (!confirmExit) return;
        }
        setEditingUser(null);
        setIsEditing(false);
        setUsernameInput("");
        setEmailInput("");
    };

    // Guardar cambios en usuario
    const saveEdit = async () => {
        if (!usernameInput.trim() || !emailInput.trim()) {
            alert("Todos los campos son obligatorios");
            return;
        }
        if (!emailInput.includes("@")) {
            alert("El correo no tiene un formato válido. Debe contener '@'.");
            return;
        }
        try {
            await axios.put(
                `http://localhost:4000/api/users/${editingUser._id}`,
                { username: usernameInput, email: emailInput },
                { withCredentials: true }
            );

            // Actualizar lista de usuarios local
            setUsers(prevUsers => prevUsers.map(u =>
                u._id === editingUser._id
                    ? { ...u, username: usernameInput, email: emailInput }
                    : u
            ));

            setEditingUser(null);
            setIsEditing(false);
            setUsernameInput("");
            setEmailInput("");
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
        }
    };

    // Ajustar tamaño de fuente del modal
    const increaseFont = () => setModalFontSize(prev => (prev < 30 ? prev + 2 : 30));
    const decreaseFont = () => setModalFontSize(prev => (prev > 14 ? prev - 2 : 14));

    // Mostrar indicador de carga
    if (loading) return <div className="flex justify-center mt-20">Cargando usuarios...</div>;

    return (
        <div className="flex flex-col min-h-screen text-[#2E3A46] font-sans" style={{ fontSize: `${fontSize}px` }}>
            {/* Navbar fijo */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow p-6 pt-28">
                {/* Barra de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por nombre de usuario o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-3 w-full rounded mb-6 text-[#2E3A46] bg-white"
                    style={{ fontSize: `${fontSize}px` }}
                />

                {/* Lista de usuarios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.length === 0 ? (
                        <div className="col-span-full flex justify-center items-center h-[calc(100vh-112px)]">
                            No hay resultados
                        </div>
                    ) : (
                        filteredUsers.map(u => (
                            <div
                                key={u._id}
                                className="bg-[#E1E5EA] p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col items-center text-center"
                                style={{ minHeight: '200px', maxHeight: '250px' }}
                            >
                                <h2 className="font-bold text-[#4A90E2] overflow-x-auto whitespace-nowrap"
                                    style={{ fontSize: `${fontSize + 2}px`, maxWidth: '100%' }}>
                                    {u.username}
                                </h2>
                                <p className="mt-1 overflow-x-auto whitespace-nowrap"
                                    style={{ fontSize: `${fontSize}px`, maxWidth: '100%' }}>
                                    {u.email}
                                </p>
                                {u.isAdmin && (
                                    <span className="mt-2 text-xs font-semibold text-[#FF6B6B]" style={{ fontSize: `${fontSize - 2}px` }}>
                                        Administrador
                                    </span>
                                )}
                                {!u.isAdmin && (
                                    <div className="flex gap-4 mt-auto w-full">
                                        <button
                                            onClick={() => openEditModal(u)}
                                            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-3 rounded-md shadow-md hover:shadow-xl hover:scale-105 transition w-1/2 text-lg"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="bg-[#D9534F] hover:bg-[#C9302C] text-white font-semibold px-4 py-3 rounded-md shadow-md hover:shadow-xl hover:scale-105 transition w-1/2 text-lg"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal de edición */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto">
                    <div className="bg-[#E1E5EA] p-6 rounded-xl w-full max-w-md flex flex-col gap-4">
                        <h2 className="text-2xl font-bold mb-2 text-[#2E3A46]">Editar Usuario</h2>

                        {/* Controles de tamaño de fuente */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={increaseFont}
                                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 flex-1"
                            >
                                A+
                            </button>
                            <button
                                onClick={decreaseFont}
                                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 flex-1"
                            >
                                A-
                            </button>
                        </div>

                        {/* Inputs de edición */}
                        <label className="block mb-1 text-[#2E3A46]">Nombre de usuario:</label>
                        <input
                            type="text"
                            className="border p-3 w-full rounded text-[#2E3A46]"
                            style={{ fontSize: `${modalFontSize}px` }}
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />

                        <label className="block mb-1 text-[#2E3A46]">Correo electrónico:</label>
                        <input
                            type="text"
                            className="border p-3 w-full rounded text-[#2E3A46]"
                            style={{ fontSize: `${modalFontSize}px` }}
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />

                        {/* Botones Guardar/Cancelar */}
                        <div className="flex justify-end gap-4 flex-wrap">
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 rounded bg-[#D9534F] text-white hover:bg-[#C9302C] flex-1 sm:flex-auto"
                                style={{ fontSize: `${modalFontSize}px` }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveEdit}
                                className="px-4 py-2 rounded bg-[#4A90E2] text-white hover:bg-[#357ABD] flex-1 sm:flex-auto"
                                style={{ fontSize: `${modalFontSize}px` }}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersPage; // Exportamos la página Usuarios de Asistente Geri