import { Router } from 'express';
import User from '../models/user.model.js'; // Modelo de usuario
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para proteger rutas

const router = Router(); // Crear un router de Express

// Obtener todos los usuarios
router.get('/users', authRequired, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Buscar todos los usuarios, excluir contraseñas
        res.json(users); // Enviar usuarios como JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Manejo de errores
    }
});

// Eliminar usuario por ID
router.delete('/users/:id', authRequired, async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id); // Buscar usuario por ID
        if (!userToDelete) return res.status(404).json({ message: "Usuario no encontrado" }); // No existe
        if (userToDelete.isAdmin) return res.status(403).json({ message: "No se puede eliminar al administrador" }); // Protección admin

        await User.findByIdAndDelete(req.params.id); // Eliminar usuario
        res.json({ message: "Usuario eliminado" }); // Confirmación
    } catch (err) {
        res.status(500).json({ message: err.message }); // Manejo de errores
    }
});

// Editar usuario por ID
router.put('/users/:id', authRequired, async (req, res) => {
    try {
        const userToEdit = await User.findById(req.params.id); // Buscar usuario por ID
        if (!userToEdit) return res.status(404).json({ message: "Usuario no encontrado" }); // No existe
        if (userToEdit.isAdmin) return res.status(403).json({ message: "No se puede editar al administrador" }); // Protección admin

        const { username, email } = req.body; // Obtener datos a actualizar
        userToEdit.username = username || userToEdit.username; // Actualizar username si se proporcionó
        userToEdit.email = email || userToEdit.email; // Actualizar email si se proporcionó
        await userToEdit.save(); // Guardar cambios en la base de datos

        res.json({ message: "Usuario actualizado", user: userToEdit }); // Enviar respuesta
    } catch (err) {
        res.status(500).json({ message: err.message }); // Manejo de errores
    }
});

export default router; // Exportar router para usarlo en el servidor principal
