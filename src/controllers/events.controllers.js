import Event from '../models/event.model.js'; // Importa el modelo Event

// Obtener todos los eventos del usuario autenticado
export const getEvents = async (req, res) => {
  try {
    // Busca todos los eventos asociados al usuario y los popula con información del usuario
    const events = await Event.find({ user: req.user.id }).populate('user');
    res.json(events); // Devuelve los eventos en formato JSON
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" }); // Error interno del servidor
  }
};

// Crear un nuevo evento
export const createEvent = async (req, res) => {
  try {
    const { title, description, dateEvent } = req.body; // Extrae datos del cuerpo de la petición
    const newEvent = new Event({
      title,
      description,
      dateEvent,
      user: req.user.id, // Asocia el evento al usuario autenticado
    });
    const savedEvent = await newEvent.save(); // Guarda el evento en la base de datos
    res.json(savedEvent); // Devuelve el evento creado
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" }); // Error interno del servidor
  }
};

// Obtener un evento específico por ID
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('user'); // Busca el evento por ID
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' }); // Si no existe, retorna 404
    res.json(event); // Devuelve el evento encontrado
  } catch (error) {
    return res.status(404).json({ message: "Evento no encontrado" }); // Error si ID inválido
  }
};

// Eliminar un evento
export const deleteEvent = async (req, res) => {
  try {
    // Busca y elimina un evento que coincida con el ID y el usuario autenticado
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' }); // Si no existe, retorna 404
    return res.sendStatus(204); // Devuelve 204 No Content al eliminar correctamente
  } catch (error) {
    return res.status(500).json({ message: 'Evento no encontrado' }); // Error interno del servidor
  }
};

// Actualizar un evento
export const updateEvent = async (req, res) => {
  try {
    // Busca y actualiza el evento por ID con los datos enviados en req.body
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Retorna el documento actualizado
    });
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' }); // Si no existe, retorna 404
    res.json(event); // Devuelve el evento actualizado
  } catch (error) {
    return res.status(404).json({ message: "Evento no encontrado" }); // Error si ID inválido
  }
};