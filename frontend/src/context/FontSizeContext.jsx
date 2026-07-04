import { createContext, useContext, useState } from "react"; // Hooks y utilidades de React

const FontSizeContext = createContext(); // Creamos el contexto para el tamaño de fuente

// Hook personalizado para usar el contexto de tamaño de fuente
export const useFontSize = () => useContext(FontSizeContext);

export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(20); // Tamaño inicial más grande para adultos mayores

  // Función para aumentar el tamaño de la fuente (máximo 30px)
  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 30));

  // Función para disminuir el tamaño de la fuente (mínimo 14px)
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 14));

  return (
    <FontSizeContext.Provider value={{ fontSize, increaseFont, decreaseFont }}>
      {/* Solo el contenido escalable se ve afectado */}
      <div style={{ fontSize: `${fontSize}px` }}>
        {children} {/* Renderizamos los hijos con el tamaño de fuente dinámico */}
      </div>
    </FontSizeContext.Provider>
  );
};