// Importa el modelo de videos
import Video from '../models/video.model.js';
// Importa el modelo de usuario
import User from '../models/user.model.js';

// Obtener todos los videos
export const getVideos = async (req, res) => {
    try {
        // Busca todos los videos y añade información del usuario (username y email)
        const videos = await Video.find().populate('user', 'username email');
        res.json(videos);
    } catch (error) {
        return res.status(500).json({ message: "Algo salio mal" });
    }
};

// Obtener un video específico por ID
export const getVideo = async (req, res) => {
    try {
        // Busca el video por ID y añade información del usuario
        const video = await Video.findById(req.params.id).populate('user', 'username email');
        if (!video) return res.status(404).json({ message: "Video no encontrado" });
        res.json(video);
    } catch (error) {
        return res.status(404).json({ message: "Video no encontrado" });
    }
};

// Crear un nuevo video (solo administradores)
export const createVideo = async (req, res) => {
    try {
        // Verifica que el usuario sea administrador
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ message: "Permiso denegado" });

        const { title, description, link } = req.body;

        // Crea el video asociándolo al usuario que lo creó
        const newVideo = new Video({
            title,
            description,
            link,
            user: req.user.id
        });

        const savedVideo = await newVideo.save();
        res.json(savedVideo);
    } catch (error) {
        return res.status(500).json({ message: "Algo salio mal" });
    }
};

// Actualizar un video existente (solo administradores)
export const updateVideo = async (req, res) => {
    try {
        // Verifica que el usuario sea administrador
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ message: "Permiso denegado" });

        // Actualiza el video por ID con los datos enviados
        const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!video) return res.status(404).json({ message: "Video no encontrado" });
        res.json(video);
    } catch (error) {
        return res.status(404).json({ message: "Video no encontrado" });
    }
};

// Eliminar un video (solo administradores)
export const deleteVideo = async (req, res) => {
    try {
        // Verifica que el usuario sea administrador
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ message: "Permiso denegado" });

        // Elimina el video por ID
        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) return res.status(404).json({ message: "Video no encontrado" });
        return res.sendStatus(204); // 204 = No Content
    } catch (error) {
        return res.status(500).json({ message: "Video no encontrado" });
    }
};