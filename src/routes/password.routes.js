import { Router } from 'express';
import User from '../models/user.model.js'; // Modelo de usuario
import Token from '../models/token.model.js'; // Modelo de token para reset de contraseña
import crypto from 'crypto'; // Para generar tokens aleatorios
import bcrypt from 'bcryptjs'; // Para hashear contraseñas
import { sendEmail } from '../utils/sendEmail.js'; // Función para enviar correos

const router = Router(); // Crear router de Express

// Enviar link de reset de contraseña
router.post('/', async (req, res) => {
  const { email } = req.body; // Obtener correo del cuerpo de la solicitud
  try {
    const user = await User.findOne({ email }); // Buscar usuario por email
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" }); // No existe

    // Generar token aleatorio
    const tokenString = crypto.randomBytes(32).toString('hex');

    // Eliminar cualquier token previo de este usuario
    await Token.findOneAndDelete({ userId: user._id });

    // Crear un nuevo token en la base de datos
    const token = await new Token({
      userId: user._id,
      token: tokenString,
    }).save();

    // Construir URL de reseteo
    const url = `http://localhost:5173/password-reset/${user._id}/${token.token}`;

    // Enviar correo con el enlace
    await sendEmail(
      user.email,
      "Restablecer contraseña",
      `Haz clic en este enlace para restablecer tu contraseña: ${url}`
    );

    res.status(200).json({ message: "Se envió un correo para restablecer la contraseña" });
  } catch (error) {
    console.error("Error en password-reset:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Verificar token de reseteo
router.get('/:id/:token', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Buscar usuario por ID
    if (!user) return res.status(400).json({ message: "Enlace inválido" });

    const token = await Token.findOne({ userId: user._id, token: req.params.token }); // Buscar token
    if (!token) return res.status(400).json({ message: "Enlace inválido" });

    res.status(200).json({ message: "Enlace válido" }); // Token válido
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Restablecer contraseña
router.post('/:id/:token', async (req, res) => {
  const { password } = req.body; // Nueva contraseña
  try {
    const user = await User.findById(req.params.id); // Buscar usuario
    if (!user) return res.status(400).json({ message: "Enlace inválido" });

    const token = await Token.findOne({ userId: user._id, token: req.params.token }); // Verificar token
    if (!token) return res.status(400).json({ message: "Enlace inválido" });

    // Hashear la nueva contraseña y guardar
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();

    // Eliminar el token usado para evitar reutilización
    await token.deleteOne();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router; // Exportar router para usar en el servidor principal