import { useEffect, useState, useMemo } from "react";
import { useVideos } from "../context/VideosContext";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { useFontSize } from "../context/FontSizeContext";
import Navbar from "../components/Navbar";
import Fuse from "fuse.js";

function VideosPage() {
  const { getVideos, videos, isAdmin } = useVideos();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUppercase, setIsUppercase] = useState(true); // 🔠 Nuevo estado

  useEffect(() => {
    getVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    if (!searchTerm.trim()) return videos;

    const fuse = new Fuse(videos, {
      keys: ["title", "description"],
      threshold: 0.4,
    });

    const results = fuse.search(searchTerm);
    return results.map((r) => r.item);
  }, [searchTerm, videos]);

  // 🔘 Función para alternar modo de mayúsculas
  const toggleUppercase = () => setIsUppercase((prev) => !prev);

  return (
    <div
      className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden bg-[#F9F6F1]"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Navbar fija */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Contenedor principal */}
      <div className="flex-grow px-4 sm:px-6 lg:px-10 pt-28 pb-10">

        {/* 🔘 Barra de búsqueda + botón de mayúsculas */}
        <div className="max-w-3xl mx-auto mb-8 w-full flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar videos por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#D1D5DB] w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            style={{ fontSize: `${fontSize}px` }}
          />
          <button
            onClick={toggleUppercase}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-3 rounded-md shadow-md transition duration-300"
          >
            {isUppercase ? "Desactivar Mayúsculas" : "Activar Mayúsculas"}
          </button>
        </div>

        {/* Grid de videos */}
        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 py-20">
              <h1
                className="font-semibold"
                style={{ fontSize: `${fontSize + 4}px` }}
              >
                No hay resultados
              </h1>
              {isAdmin && (
                <button
                  onClick={() => navigate("/add-videos")}
                  className="bg-[#4A90E2] hover:bg-[#357ABD] transform hover:scale-105 transition duration-300 text-white font-semibold px-6 py-4 rounded-md shadow-md"
                >
                  + Añadir Video
                </button>
              )}
            </div>
          ) : (
            <>
              {filteredVideos.map((video) => (
                <VideoCard video={video} key={video._id} isUppercase={isUppercase} />
              ))}

              {isAdmin && (
                <div
                  onClick={() => navigate("/add-videos")}
                  className="flex items-center justify-center bg-[#E1E5EA] rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer p-6"
                >
                  <span
                    style={{ fontSize: `${fontSize}px` }}
                    className="font-semibold text-center"
                  >
                    + Añadir Video
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideosPage;