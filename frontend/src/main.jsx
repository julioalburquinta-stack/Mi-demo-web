import { StrictMode } from 'react' // Importamos StrictMode para ayudar a detectar errores y prácticas no seguras en React
import { createRoot } from 'react-dom/client' // Importamos createRoot para renderizar la aplicación en el DOM
import './index.css' // Importamos los estilos globales
import App from './App.jsx' // Importamos el componente principal de la aplicación

// Renderizamos la aplicación dentro del elemento con id "root"
createRoot(document.getElementById('root')).render(
  <StrictMode> 
    {/* StrictMode envuelve la app para activar comprobaciones adicionales en desarrollo */}
    <App /> {/* Renderizamos el componente principal */}
  </StrictMode>,
)