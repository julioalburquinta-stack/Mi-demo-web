// Importaciones principales
import { useForm } from 'react-hook-form'; // Hook para manejo de formularios
import { useBenefits } from '../context/BenefitsContext'; // Contexto para funciones y datos de beneficios
import { useNavigate, useParams } from 'react-router-dom'; // Para navegar y leer parámetros de URL
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; // Barra de navegación

function BenefitsFormPage() {
  // Inicializamos React Hook Form
  const { register, handleSubmit, setValue, watch } = useForm();

  // Obtenemos funciones del contexto de beneficios
  const { createBenefit, getBenefit, updateBenefit, isAdmin } = useBenefits();

  const navigate = useNavigate(); // Para navegación programática
  const params = useParams(); // Leer parámetros de la URL (ej. ID)

  const [initialBenefit, setInitialBenefit] = useState(null); // Guardar estado inicial para detectar cambios
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Detecta si hay cambios no guardados

  // Observamos los valores de los campos
  const watchTitle = watch("title", "");
  const watchDescription = watch("description", "");
  const watchLink = watch("link", "");

  // Detecta cambios respecto al estado inicial para marcar como "no guardado"
  useEffect(() => {
    if (!initialBenefit) return;
    setHasUnsavedChanges(
      watchTitle !== initialBenefit.title ||
      watchDescription !== initialBenefit.description ||
      watchLink !== initialBenefit.link
    );
  }, [watchTitle, watchDescription, watchLink, initialBenefit]);

  // Verifica que el usuario sea administrador
  useEffect(() => {
    if (!isAdmin) {
      alert("No tienes permisos para acceder a esta página");
      navigate("/benefits");
    }
  }, [isAdmin, navigate]);

  // Carga el beneficio si existe un ID en la URL
  useEffect(() => {
    async function loadBenefit() {
      if (params.id) {
        const benefit = await getBenefit(params.id); // Obtener beneficio existente
        if (benefit) {
          setValue('title', benefit.title); // Rellenar campos
          setValue('description', benefit.description);
          setValue('link', benefit.link);
          setInitialBenefit(benefit); // Guardar estado inicial
        }
      } else {
        // Nuevo beneficio vacío
        setInitialBenefit({ title: "", description: "", link: "" });
      }
    }
    loadBenefit();
  }, [params.id, setValue, getBenefit]);

  // Previene cerrar la página si hay cambios sin guardar
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

  // Función que maneja el envío del formulario
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
      return; // Detener envío si faltan campos
    }

    // Confirmación del link antes de guardar
    const linkConfirmed = window.confirm("¿Has verificado que el link del beneficio estatal es correcto?");
    if (!linkConfirmed) return;

    // Crear o actualizar beneficio según exista ID
    if (params.id) {
      updateBenefit(params.id, dataValid);
    } else {
      createBenefit(dataValid);
    }

    setHasUnsavedChanges(false); // Reset cambios no guardados
    navigate('/benefits'); // Volver al listado
  });

  // Maneja el botón de cancelar
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("¿Estás seguro de que quieres cancelar? Se perderán los cambios.");
      if (!confirmed) return;
    }
    navigate('/benefits');
  };

  return (
    <div className="flex flex-col min-h-screen text-[#2E3A46] font-sans">
      {/* Navbar fija */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar hasUnsavedChanges={hasUnsavedChanges} />
      </div>

      {/* Contenedor del formulario */}
      <div className="flex-grow flex items-center justify-center bg-[#F9F6F1] px-4 pt-28">
        <div className="bg-[#E1E5EA] w-full max-w-lg p-8 sm:p-6 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            {params.id ? "Editar Beneficio" : "Crear Beneficio"}
          </h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">

            {/* Campo Título */}
            <label htmlFor="title" className="font-semibold text-lg">Título</label>
            <input 
              id="title"
              type="text"
              placeholder="Título"
              {...register("title")}
              onInput={(e) => setValue("title", e.target.value.toUpperCase())} // Convertir a mayúsculas
              className="w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              autoFocus
            />

            {/* Campo Descripción */}
            <label htmlFor="description" className="font-semibold text-lg">Descripción</label>
            <textarea 
              id="description"
              rows="4"
              placeholder="Descripción"
              {...register("description")}
              onInput={(e) => setValue("description", e.target.value.toUpperCase())} // Convertir a mayúsculas
              className="w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />

            {/* Campo Link */}
            <label htmlFor="link" className="font-semibold text-lg">Link</label>
            <input 
              id="link"
              type="url"
              placeholder="URL del beneficio"
              {...register("link")}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />

            {/* Botones Guardar y Cancelar */}
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

// Exportamos la página del formulario de beneficios estatales
export default BenefitsFormPage;