import express from "express"; // Framework para crear el servidor
import morgan from 'morgan'; // Middleware para registrar peticiones HTTP en consola
import cookieParser from "cookie-parser"; // Middleware para manejar cookies
import cors from 'cors'; // Middleware para habilitar CORS
import dotenv from 'dotenv'; // Para usar variables de entorno desde .env
dotenv.config(); // Carga las variables definidas en el archivo .env

// Importamos las rutas
import authRoutes from './routes/auth.routes.js'; // Rutas de autenticación (login, registro, etc.)
import eventRoutes from "./routes/events.routes.js"; // Rutas para manejar eventos
import videoRoutes from "./routes/video.routes.js"; // Rutas para manejar videos
import benefitRoutes from "./routes/benefits.routes.js"; // Rutas para beneficios
import usersRoutes from './routes/users.routes.js'; // Rutas para administración de usuarios
import passwordRoutes from './routes/password.routes.js'; // Rutas para recuperación de contraseña

const app = express(); // Inicializamos la aplicación de Express

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: "http://localhost:5173", // Dirección del frontend
    credentials: true // Permitir envío de cookies y credenciales
}));

// Middlewares globales
app.use(morgan('dev')); // Mostrar logs de peticiones en consola
app.use(express.json()); // Interpretar cuerpos JSON en las peticiones
app.use(cookieParser()); // Permitir trabajar con cookies

// Definimos prefijos para cada grupo de rutas
app.use("/api", authRoutes); 
app.use("/api", eventRoutes);
app.use("/api", videoRoutes); 
app.use("/api", benefitRoutes);
app.use("/api", usersRoutes);
app.use('/api/password-reset', passwordRoutes); // Rutas específicas de reseteo de contraseña

export default app; // Exportamos la app para iniciarla en el servidor