import { useBenefits } from "../context/BenefitsContext";
import { Link } from "react-router-dom";

function BenefitsCard({ benefit }) {
  const { deleteBenefit, isAdmin } = useBenefits();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este beneficio? Esta acción no se puede deshacer."
    );
    if (confirmed) {
      deleteBenefit(benefit._id);
    }
  };

  return (
    <div className="bg-[#E1E5EA] p-6 rounded-2xl shadow-md flex flex-col justify-between h-full">
      {/* ✅ Título (se muestra el texto formateado que viene desde BenefitsPage) */}
      <h2 className="text-2xl font-bold mb-2 text-[#2E3A46]">
        {benefit.title}
      </h2>

      {/* ✅ Descripción (respeta saltos de línea y el texto formateado) */}
      <div className="text-[#2E3A46] mb-4 flex-1 overflow-auto max-h-48 whitespace-pre-line">
        {benefit.description}
      </div>

      {benefit.link && (
        <a
          href={benefit.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-md shadow-md mb-4 text-center transition duration-300"
        >
          Para más información
        </a>
      )}

      {isAdmin && (
        <div className="flex gap-4 mt-auto">
          <button
            className="bg-[#D9534F] hover:bg-[#C9302C] transition-transform transform hover:scale-105 text-white font-semibold px-4 py-3 rounded-md shadow-md w-1/2 text-lg"
            onClick={handleDelete}
          >
            Eliminar
          </button>
          <Link
            to={`/benefits/${benefit._id}`}
            className="bg-[#4A90E2] hover:bg-[#357ABD] transition-transform transform hover:scale-105 text-white font-semibold px-4 py-3 rounded-md shadow-md w-1/2 text-center text-lg"
          >
            Editar
          </Link>
        </div>
      )}
    </div>
  );
}

export default BenefitsCard;