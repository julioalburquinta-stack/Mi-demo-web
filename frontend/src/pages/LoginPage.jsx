import { useForm } from 'react-hook-form';
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useFontSize } from "../context/FontSizeContext";
import Navbar from "../components/Navbar";

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="flex flex-col min-h-screen text-[#2E3A46] font-sans overflow-x-hidden"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Navbar fijo arriba */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Contenedor central del formulario */}
      <div className="flex flex-grow items-center justify-center px-4 sm:px-6 lg:px-10 py-12 pt-28">
        <div className="bg-[#F0F4F8] w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl shadow-md border border-[#E1E5EA]">

          {/* Mostrar errores de inicio de sesión */}
          {signinErrors.length > 0 && signinErrors.map((error, i) => (
            <div className="bg-[#D9534F] p-3 text-white text-center my-2 rounded-md" key={i}>
              {error}
            </div>
          ))}

          <h1 className="font-bold my-6 text-center text-[#2E3A46] leading-snug">Iniciar Sesión</h1>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-5">
            <label className="font-semibold text-[#2E3A46]">Email</label>
            <input 
              type="email"
              {...register("email", { required: true })}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-md border border-[#E1E5EA] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Correo electrónico"
              autoFocus
            />
            {errors.email && <p className="text-[#D9534F] text-sm">Se necesita el email</p>}

            <label className="font-semibold text-[#2E3A46]">Contraseña</label>
            <input 
              type="password"
              {...register("password", { required: true })}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-md border border-[#E1E5EA] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Contraseña"
            />
            {errors.password && <p className="text-[#D9534F] text-sm">Se necesita la contraseña</p>}

            <button 
              type="submit"
              className="bg-[#4A90E2] hover:bg-[#357ABD] transition-transform transform hover:scale-105 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-md mt-4 sm:mt-6"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Link a Olvidar contraseña */}
          <p className="text-center text-[#2E3A46] mt-4 sm:mt-6">
            <Link to="/forgot-password" className="text-[#4A90E2] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>

          {/* Link a registro */}
          <p className="text-center text-[#2E3A46] mt-2 sm:mt-4">
            ¿No tiene una cuenta?{" "}
            <Link to="/register" className="text-[#4A90E2] hover:underline">Regístrese</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;