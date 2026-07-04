import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../api/passwordApi";
import Navbar from "../components/Navbar";
import { useFontSize } from "../context/FontSizeContext";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [error, setError] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyResetToken(id, token);
        setValid(true);
      } catch {
        setValid(false);
      }
    };
    verify();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      await resetPassword(id, token, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  // Render token inválido
  if (!valid) {
    return (
      <div className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden" style={{ fontSize: `${fontSize}px` }}>
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        <div className="flex-grow flex items-center justify-center bg-[#F9F6F1] px-4 sm:px-6 lg:px-10 pt-28">
          <div className="bg-[#E1E5EA] w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-md text-center">
            <p className="text-red-600 font-semibold text-lg">Enlace inválido</p>
          </div>
        </div>

        <footer className="bg-[#E1E5EA] w-full text-center py-8 mt-20 rounded-t-xl shadow-inner px-4 sm:px-0">
          <p className="leading-relaxed">
            <span className="text-[#4A90E2] font-semibold">
              Asistente Geri © 2025 - Todos los Derechos Reservados
            </span>
          </p>
        </footer>
      </div>
    );
  }

  // Render token válido
  return (
    <div className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden" style={{ fontSize: `${fontSize}px` }}>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center bg-[#F9F6F1] px-4 sm:px-6 lg:px-10 pt-28">
        <div className="bg-[#E1E5EA] w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 leading-snug">Actualizar Contraseña</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <label htmlFor="password" className="font-semibold text-[#2E3A46]">Nueva contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length < 6) {
                  setError("La contraseña debe tener al menos 6 caracteres.");
                } else {
                  setError("");
                }
              }}
              required
              placeholder="Nueva contraseña"
              className="w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />

            <button
              type="submit"
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-md shadow-md mt-2 sm:mt-3"
            >
              Actualizar contraseña
            </button>

            {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
          </form>
        </div>
      </div>

      <footer className="bg-[#E1E5EA] w-full text-center py-8 mt-20 rounded-t-xl shadow-inner px-4 sm:px-0">
        <p className="leading-relaxed">
          <span className="text-[#4A90E2] font-semibold">
            Asistente Geri © 2025 - Todos los Derechos Reservados
          </span>
        </p>
      </footer>
    </div>
  );
};

export default PasswordReset;