import { useState } from "react";
import { sendResetLink } from "../api/passwordApi"; 
import Navbar from "../components/Navbar";
import { useFontSize } from "../context/FontSizeContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); 
  const [msg, setMsg] = useState(""); 
  const [error, setError] = useState(""); 
  const { fontSize } = useFontSize(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    setMsg(`Si ${email} está registrado, recibirás un correo con el enlace para restablecer tu contraseña.`);
    setError("");

    try {
      await sendResetLink(email); 
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error al enviar el correo."); 
      setMsg(""); 
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Navbar fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Contenedor principal */}
      <div className="flex-grow flex items-center justify-center bg-[#F9F6F1] px-4 sm:px-6 lg:px-10 pt-28">
        <div className="bg-[#E1E5EA] w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-md">

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 leading-snug">
            Recuperar Contraseña
          </h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <label htmlFor="email" className="font-semibold text-[#2E3A46]">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="tu@correo.com"
              className="w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />

            <button
              type="submit"
              className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-md shadow-md mt-2 sm:mt-3"
            >
              Enviar link
            </button>

            {msg && <p className="text-green-600 font-semibold mt-2">{msg}</p>}
            {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#E1E5EA] w-full text-center py-8 mt-20 rounded-t-xl shadow-inner px-4 sm:px-0">
        <p className="leading-relaxed">
          <span className="text-[#4A90E2] font-semibold">Asistente Geri © 2025 - Todos los Derechos Reservados</span>
        </p>
      </footer>
    </div>
  );
};

export default ForgotPassword;