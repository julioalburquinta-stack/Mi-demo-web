import { useVideos } from "../context/VideosContext";
import { Link } from "react-router-dom";

function VideoCard({ video, isUppercase }) {
    const { deleteVideo, isAdmin } = useVideos();

    const handleDelete = () => {
        const confirmed = window.confirm(
            "¿Estás seguro de que quieres eliminar este video? Esta acción no se puede deshacer."
        );
        if (confirmed) deleteVideo(video._id);
    };

    // ✨ Función para cambiar formato del texto
    const formatText = (text) => {
        if (!text) return "";
        return isUppercase
            ? text.toUpperCase()
            : text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    return (
        <div
            className="relative bg-[#E1E5EA] p-6 rounded-2xl shadow-md flex flex-col justify-between"
            style={{ minHeight: "300px", maxHeight: "350px" }}
        >
            <h2 className="text-2xl font-bold text-[#2E3A46] mb-2">
                {formatText(video.title)}
            </h2>

            <div className="text-[#2E3A46] mb-2 overflow-y-auto overflow-x-hidden break-words whitespace-pre-line scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                {formatText(video.description)}
            </div>

            <a
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-md shadow-md text-center transition duration-300 mb-2"
            >
                Para ver el video
            </a>

            {isAdmin && (
                <div className="flex gap-4">
                    <button
                        className="bg-[#D9534F] hover:bg-[#C9302C] transition-transform transform hover:scale-105 text-white font-semibold px-4 py-3 rounded-md shadow-md w-1/2 text-lg"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </button>

                    <Link
                        to={`/videos/${video._id}`}
                        className="bg-[#4A90E2] hover:bg-[#357ABD] transition-transform transform hover:scale-105 text-white font-semibold px-4 py-3 rounded-md shadow-md w-1/2 text-center text-lg"
                    >
                        Editar
                    </Link>
                </div>
            )}
        </div>
    );
}

export default VideoCard;