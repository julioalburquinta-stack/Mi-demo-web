// Importa el modelo de usuario
import User from '../models/user.model.js';
// Importa bcryptjs para hashear y comparar contraseñas
import bcrypt from 'bcryptjs';
// Importa la función para crear tokens JWT
import {createAccessToken} from '../libs/jwt.js';
// Importa jsonwebtoken para verificar tokens
import jwt from 'jsonwebtoken';
// Importa la clave secreta para firmar/verificar tokens
import { TOKEN_SECRET } from '../config.js';

// Define el correo del administrador
const ADMIN_EMAIL = "julioalburquinta@gmail.com";

// Registro de usuario
export const register = async (req, res) => {
    const {email, password, username} = req.body; 

    try {
        // Verifica si el usuario ya existe
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json(["El correo ya está en uso"]);

        // Hashea la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crea un nuevo usuario
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            isAdmin: email === ADMIN_EMAIL // Asigna rol de admin si el correo coincide
        });

        // Guarda el usuario en la base de datos
        const userSaved = await newUser.save();

        // Crea un token de acceso para el usuario
        const token = await createAccessToken({id: userSaved._id});
        
        // Guarda el token en una cookie httpOnly
        res.cookie('token', token, { httpOnly: true });

        // Devuelve los datos del usuario
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            isAdmin: userSaved.isAdmin,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    const {email, password } = req.body; 

    try {
        // Busca al usuario por correo
        const userFound = await User.findOne({email});
        if (!userFound) return res.status(400).json(["Usuario no encontrado"]);

        // Compara la contraseña ingresada con la almacenada
        const isMatch = await bcrypt.compare(password, userFound.password); 
        if (!isMatch) return res.status(400).json(["Contraseña incorrecta"]);

        // Crea un token de acceso
        const token = await createAccessToken({id: userFound._id});
        
        // Guarda el token en una cookie httpOnly
        res.cookie('token', token, { httpOnly: true });

        // Devuelve los datos del usuario
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            isAdmin: userFound.isAdmin,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
    } catch (error) {
       res.status(500).json({ message: error.message });
    }
};

// Cerrar sesión
export const logout = (req, res) => {
    // Elimina la cookie del token expirándola
    res.cookie('token', "", {
        expires: new Date(0),
        httpOnly: true
    });
    return res.sendStatus(200);
};

// Obtener perfil del usuario
export const profile = async (req, res) => {
    // Busca al usuario por id obtenido del token
    const userFound = await User.findById(req.user.id);
    
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });
    
    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    });
}

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
    try {
        // Verifica que sea admin
        const userRequesting = await User.findById(req.user.id);
        if (!userRequesting?.isAdmin) 
            return res.status(403).json({ message: "Acceso denegado" });

        // Obtiene todos los usuarios
        const users = await User.find().select('-password'); // excluye contraseña
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Verificación de token
export const verifyToken = async (req, res) => {
    const {token} = req.cookies;

    // Si no hay token, devuelve error 401
    if (!token) return res.status(401).json({ message: "Sin autorizacion" });

    // Verifica el token
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Sin autorizacion" });

        // Busca al usuario en la base de datos
        const userFound = await User.findById(user.id);
        if(!userFound) return res.status(401).json({ message: "Sin autorizacion" });

        // Devuelve los datos del usuario si el token es válido
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            isAdmin: userFound.isAdmin
        });
    });
};