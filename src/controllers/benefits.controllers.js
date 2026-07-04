// Importa el modelo de beneficios
import Benefit from '../models/benefits.model.js';
// Importa el modelo de usuario
import User from '../models/user.model.js';

// Obtener todos los beneficios
export const getBenefits = async (req, res) => {
    try {
        // Busca todos los beneficios y añade información del usuario (username y email)
        const benefits = await Benefit.find().populate('user', 'username email');
        res.json(benefits);
    } catch (error) {
        return res.status(500).json({ message: "Algo salio mal" });
    }
};

// Obtener un beneficio específico por ID
export const getBenefit = async (req, res) => {
    try {
        // Busca el beneficio por ID y añade información del usuario
        const benefit = await Benefit.findById(req.params.id).populate('user', 'username email');
        if (!benefit) return res.status(404).json({ message: "Beneficio no encontrado" });
        res.json(benefit);
    } catch (error) {
        return res.status(404).json({ message: "Beneficio no encontrado" });
    }
};

// Crear un nuevo beneficio (solo administradores)
export const createBenefit = async (req, res) => {
    try {
        // Verifica que el usuario sea administrador
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ message: "Permiso denegado" });

        const { title, description, link } = req.body;

        // Crea el beneficio asociándolo al usuario que lo creó
        const newBenefit = new Benefit({
            title,
            description,
            link,
            user: req.user.id
        });

        const savedBenefit = await newBenefit.save();
        res.json(savedBenefit);
    } catch (error) {
        return res.status(500).json({ message: "Algo salio mal" });
    }
};

// Actualizar un beneficio existente (solo administradores)
export const updateBenefit = async (req, res) => {
    try {
        // Verifica que el usuario sea administrador
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ message: "Permiso denegado" });

        // Actualiza el beneficio por ID con los datos enviados
        const benefit = await Benefit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!benefit) return res.status(404).json({ message: "Beneficio no encontrado" });
        res.json(benefit);
    } catch (error) {
        return res.status(404).json({ message: "Beneficio no encontrado" });
    }
};

// Eliminar un beneficio (solo administradores)
export const deleteBenefit = async (req, res) => {
    try {
        // Verifica que el usuario sea administrador
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) return res.status(403).json({ message: "Permiso denegado" });

        // Elimina el beneficio por ID
        const benefit = await Benefit.findByIdAndDelete(req.params.id);
        if (!benefit) return res.status(404).json({ message: "Beneficio no encontrado" });
        return res.sendStatus(204); // 204 = No Content
    } catch (error) {
        return res.status(500).json({ message: "Beneficio no encontrado" });
    }
};
