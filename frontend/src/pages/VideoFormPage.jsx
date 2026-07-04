import { useForm } from 'react-hook-form'; // Para manejar formularios y validaciones
import { useVideos } from '../context/VideosContext'; // Contexto de videos
import { useNavigate, useParams } from 'react-router-dom'; // Hooks de navegación y parámetros de ruta
import { useEffect, useState } from 'react'; 
import Navbar from '../components/Navbar'; 
import { useAuth } from '../context/AuthContext'; // Contexto de autenticación

function VideoFormPage() {
  // Hooks de React Hook Form
  const { register, handleSubmit, setValue, watch } = useForm();

  // Funciones y datos del contexto de videos
  const { createVideo, getVideo, updateVideo, isAdmin } = useVideos();
  const { logout } = useAuth(); // Función para cerrar sesión
  const navigate = useNavigate(); // Navegación entre rutas
  const params = useParams(); // Parámetros de la URL (ej: id del video)

  // Estado local
  const [initialVideo, setInitialVideo] = useState({ title: "", description: "", link: "" });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Observar los campos del formulario para detectar cambios
  const watchTitle = watch("title", "");
  const watchDescription = watch("description", "");
  const watchLink = watch("link", "");

  // Detectar cambios sin guardar
  useEffect(() => {
    setHasUnsavedChanges(
      watchTitle.trim() !== initialVideo.title.trim() ||
      watchDescription.trim() !== initialVideo.description.trim() ||
      watchLink.trim() !== initialVideo.link.trim()
    );
  }, [watchTitle, watchDescription, watchLink, initialVideo]);

  // Bloquear acceso si no es administrador
  useEffect(() => {
    if (!isAdmin) {
      alert("No tienes permisos para acceder a esta página");
      navigate("/videos");
    }
  }, [isAdmin, navigate]);

  // Cargar video si se está editando
  useEffect(() => {
    async function loadVideo() {
      if (params.id) {
        const video = await getVideo(params.id);
        if (video) {
          setValue('title', video.title);
          setValue('description', video.description);
          setValue('link', video.link);
          setInitialVideo({ title: video.title, description: video.description, link: video.link });
        }
      } else {
        setInitialVideo({ title: "", description: "", link: "" });
      }
    }
    loadVideo();
  }, [params.id, setValue, getVideo]);

  // Prevenir cerrar la ventana si hay cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Cancelar edición/creación
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("¿Estás seguro de que quieres cancelar? Se perderán los cambios.");
      if (!confirmed) return;
    }
    navigate('/videos');
  };

  // Cierre de sesión considerando cambios sin guardar
  const handleLogout = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("Tienes cambios sin guardar. ¿Seguro que quieres cerrar sesión?");
      if (!confirmed) return;
    }
    logout(); // Cerramos sesión
    navigate("/login");
  };

  // Convertir campos a mayúsculas mientras se escribe
  const handleUpperCaseChange = (field, value) => setValue(field, value.toUpperCase());

  // Manejo del envío del formulario
  const onSubmit = handleSubmit((data) => {
    const dataValid = {
      title: data.title.trim(),
      description: data.description.trim(),
      link: data.link.trim(),
    };

    // Validación de campos obligatorios
    const missingFields = [];
    if (!dataValid.title) missingFields.push({ text: "el título", female: false });
    if (!dataValid.description) missingFields.push({ text: "la descripción", female: true });
    if (!dataValid.link) missingFields.push({ text: "el link", female: false });

    if (missingFields.length > 0) {
      let message = "";
      if (missingFields.length === 1) {
        message = `${missingFields[0].text} ${missingFields[0].female ? "es obligatoria" : "es obligatorio"}.`;
      } else {
        const texts = missingFields.map(f => f.text);
        const last = texts.pop();
        message = `${texts.join(", ")} y ${last} son obligatorios.`;
      }
      alert(message);
      return;
    }

    // Confirmación adicional sobre el link
    const linkConfirmed = window.confirm("¿Has verificado que el link del video es correcto?");
    if (!linkConfirmed) return;

    // Crear o actualizar video según si hay id en params
    if (params.id) {
      updateVideo(params.id, dataValid);
    } else {
      createVideo(dataValid);
    }

    setHasUnsavedChanges(false); // Reseteamos cambios pendientes
    navigate('/videos'); // Redirigimos a la lista de videos
  });

  return (
    <div className="flex flex-col min-h-screen text-[#2E3A46] font-sans">
      {/* Navbar fija con control de logout y cambios sin guardar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar onLogout={handleLogout} hasUnsavedChanges={hasUnsavedChanges} />
      </div>

      {/* Formulario centralizado */}
      <div className="flex-grow flex items-center justify-center bg-[#F9F6F1] px-4 pt-28">
        <div className="bg-[#E1E5EA] w-full max-w-lg p-8 sm:p-6 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            {params.id ? "Editar Video" : "Crear Video"}
          </h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Título */}
            <label htmlFor="title" className="font-semibold text-lg">Título</label>
            <input
              type="text"
              placeholder="Título"
              {...register("title")}
              value={watchTitle}
              onChange={(e) => handleUpperCaseChange("title", e.target.value)}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              autoFocus
            />

            {/* Descripción */}
            <label htmlFor="description" className="font-semibold text-lg">Descripción</label>
            <textarea
              rows="4"
              placeholder="Descripción"
              {...register("description")}
              value={watchDescription}
              onChange={(e) => handleUpperCaseChange("description", e.target.value)}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />

            {/* Link */}
            <label htmlFor="link" className="font-semibold text-lg">Link</label>
            <input
              type="url"
              placeholder="URL del video"
              {...register("link")}
              value={watchLink}
              onChange={(e) => setValue("link", e.target.value)}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />

            {/* Botones de Guardar y Cancelar */}
            <div className="flex gap-4 mt-4 flex-col sm:flex-row">
              <button
                type="submit"
                className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-3 rounded-md shadow-md w-full sm:w-1/2"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-[#D9534F] hover:bg-[#C9302C] text-white font-semibold px-4 py-3 rounded-md shadow-md w-full sm:w-1/2"
              >
                Cancelar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default VideoFormPage; // Exportamos la página formulario de videos