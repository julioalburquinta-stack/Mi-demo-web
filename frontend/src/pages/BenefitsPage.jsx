import { useEffect, useState, useMemo } from "react";
import { useBenefits } from "../context/BenefitsContext";
import { useNavigate } from "react-router-dom";
import BenefitsCard from "../components/BenefitsCard";
import Navbar from "../components/Navbar";
import Fuse from "fuse.js";
import { useFontSize } from "../context/FontSizeContext";

function BenefitsPage() {
  const { getBenefits, benefits, isAdmin } = useBenefits();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();

  const [searchTerm, setSearchTerm] = useState("");
  const [isUppercase, setIsUppercase] = useState(true);

  useEffect(() => {
    getBenefits();
  }, []);

  const toggleUppercase = () => setIsUppercase((prev) => !prev);

  // ✅ Función para formatear texto dinámicamente
  const formatText = (text) => {
    if (!text) return "";
    if (isUppercase) return text;
    // convierte todo a minúsculas y capitaliza solo la primera letra de cada oración
    return text
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  // ✅ Filtrado con Fuse.js
  const filteredBenefits = useMemo(() => {
    if (!searchTerm.trim()) return benefits;

    const fuse = new Fuse(benefits, {
      keys: ["title", "description"],
      threshold: 0.4,
    });

    const results = fuse.search(searchTerm);
    return results.map((r) => r.item);
  }, [searchTerm, benefits]);

  // ✅ Recalcular beneficios con formato cada vez que cambia isUppercase
  const displayedBenefits = useMemo(() => {
    return filteredBenefits.map((benefit) => ({
      ...benefit,
      title: formatText(benefit.title),
      description: formatText(benefit.description),
    }));
  }, [filteredBenefits, isUppercase]);

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
      <div className="flex-grow px-4 sm:px-6 lg:px-10 pt-36 pb-10">
        {/* 🔍 Barra de búsqueda + botón de mayúsculas */}
        <div className="max-w-3xl mx-auto mb-8 w-full flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar beneficios por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#D1D5DB] w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            style={{ fontSize: `${fontSize}px` }}
          />

          {/* Botón de mayúsculas */}
          <button
            onClick={toggleUppercase}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-3 rounded-md shadow-md transition duration-300"
          >
            {isUppercase ? "Desactivar Mayúsculas" : "Activar Mayúsculas"}
          </button>
        </div>

        {/* Grid de beneficios */}
        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          {displayedBenefits.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 py-20">
              <h1
                className="font-semibold"
                style={{ fontSize: `${fontSize + 4}px` }}
              >
                No hay resultados
              </h1>
              {isAdmin && (
                <button
                  onClick={() => navigate("/add-benefits")}
                  className="bg-[#4A90E2] hover:bg-[#357ABD] transform hover:scale-105 transition duration-300 text-white font-semibold px-6 py-4 rounded-md shadow-md"
                >
                  + Añadir Beneficio
                </button>
              )}
            </div>
          ) : (
            <>
              {displayedBenefits.map((benefit) => (
                <BenefitsCard key={benefit._id} benefit={benefit} />
              ))}

              {isAdmin && (
                <div
                  onClick={() => navigate("/add-benefits")}
                  className="flex items-center justify-center bg-[#E1E5EA] rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer p-6"
                >
                  <span
                    style={{ fontSize: `${fontSize}px` }}
                    className="font-semibold text-center"
                  >
                    + Añadir Beneficio
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

export default BenefitsPage;