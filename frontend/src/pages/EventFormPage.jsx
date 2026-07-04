import { useForm } from 'react-hook-form';
import { useEvents } from '../context/EventsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Navbar from '../components/Navbar';

dayjs.extend(utc);

function EventFormPage() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const { createEvent, getEvent, updateEvent } = useEvents();
  const navigate = useNavigate();
  const params = useParams();

  const watchTitle = watch("title", "");
  const watchDescription = watch("description", "");
  const watchDateEvent = watch("dateEvent", "");

  const [initialEvent, setInitialEvent] = useState({ title: "", description: "", dateEvent: "" });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (params.id) {
        const event = await getEvent(params.id);
        if (event) {
          const title = event.title.toUpperCase();
          const description = event.description.toUpperCase();
          const dateEvent = dayjs(event.dateEvent).local().format('YYYY-MM-DD');

          setValue('title', title);
          setValue('description', description);
          setValue('dateEvent', dateEvent);
          setInitialEvent({ title, description, dateEvent });
        }
      }
    }
    loadEvent();
  }, [params.id, setValue, getEvent]);

  useEffect(() => {
    const changed =
      watchTitle.trim() !== initialEvent.title.trim() ||
      watchDescription.trim() !== initialEvent.description.trim() ||
      watchDateEvent !== initialEvent.dateEvent;
    setHasUnsavedChanges(changed);
  }, [watchTitle, watchDescription, watchDateEvent, initialEvent]);

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

  const onSubmit = handleSubmit((data) => {
    const dataValid = {
      ...data,
      title: data.title.toUpperCase(),
      description: data.description.toUpperCase(),
      dateEvent: data.dateEvent ? dayjs(data.dateEvent).utc().format() : dayjs().utc().format(),
    };

    const titleChanged = dataValid.title.trim() !== initialEvent.title.trim();
    const descriptionChanged = dataValid.description.trim() !== initialEvent.description.trim();
    const shouldValidate = !params.id || titleChanged || descriptionChanged;

    if (shouldValidate) {
      if (!dataValid.title.trim() && !dataValid.description.trim()) {
        alert("El título y la descripción son obligatorios");
        return;
      }
      if (!dataValid.title.trim()) {
        alert("El título es obligatorio");
        return;
      }
      if (!dataValid.description.trim()) {
        alert("La descripción es obligatoria");
        return;
      }
    }

    const today = dayjs().startOf('day');
    const selectedDate = dayjs(data.dateEvent).startOf('day');
    if (selectedDate.isBefore(today)) {
      alert("No puedes seleccionar una fecha pasada");
      return;
    }

    if (params.id) {
      updateEvent(params.id, dataValid);
    } else {
      createEvent(dataValid);
    }

    setHasUnsavedChanges(false);
    navigate('/events');
  });

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("¿Estás seguro de que quieres cancelar? Se perderán los cambios.")) return;
    }
    navigate('/events');
  };

  const minDate = dayjs().format('YYYY-MM-DD');

  return (
    <div className="flex flex-col min-h-screen text-[#2E3A46] font-sans">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar hasUnsavedChanges={hasUnsavedChanges} />
      </div>

      <div className='flex-grow flex items-center justify-center bg-[#F9F6F1] px-4 pt-28 pb-10'>
        <div className='bg-[#E1E5EA] w-full max-w-lg p-8 sm:p-6 rounded-2xl shadow-md'>
          <h1 className="text-3xl font-bold text-center mb-6">
            {params.id ? "Editar Evento" : "Crear Evento"}
          </h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">

            <label htmlFor="title" className="font-semibold text-lg">Título</label>
            <input 
              type="text" 
              placeholder='Título'
              {...register("title")}
              value={watchTitle}
              onChange={(e) => setValue("title", e.target.value.toUpperCase())}
              className='w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]'
              autoFocus
            />

            <label htmlFor="description" className="font-semibold text-lg">Descripción</label>
            <textarea 
              rows="4" 
              placeholder='Descripción'
              {...register("description")}
              value={watchDescription}
              onChange={(e) => setValue("description", e.target.value.toUpperCase())}
              className='w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]'
            />

            <label htmlFor="dateEvent" className="font-semibold text-lg">Para cuándo:</label>
            <input 
              type="date" 
              {...register('dateEvent')}
              min={minDate}
              className='w-full bg-white text-[#2E3A46] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]'
            />

            <div className="flex gap-4 mt-4 flex-col sm:flex-row">
              <button type="submit" className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-3 rounded-md shadow-md w-full sm:w-1/2">
                Guardar
              </button>
              <button type="button" onClick={handleCancel} className="bg-[#D9534F] hover:bg-[#C9302C] text-white font-semibold px-4 py-3 rounded-md shadow-md w-full sm:w-1/2">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventFormPage;