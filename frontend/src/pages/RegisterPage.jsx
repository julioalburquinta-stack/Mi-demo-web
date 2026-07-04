import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFontSize } from "../context/FontSizeContext";
import Navbar from "../components/Navbar";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  const { fontSize } = useFontSize();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    await signup(values);
  };

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

          {/* Mostrar errores de registro */}
          {registerErrors && registerErrors.map((error, i) => (
            <div className="bg-[#D9534F] p-3 text-white my-2 rounded-md text-center" key={i}>
              {error}
            </div>
          ))}

          <h1 className="font-bold my-6 text-center text-[#2E3A46] leading-snug">Registro</h1>

          {/* Formulario de registro */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-5">
            {/* Campo Usuario */}
            <label className="font-semibold text-[#2E3A46]">Usuario</label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-md border border-[#E1E5EA] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Nombre de usuario"
              autoFocus
            />
            {errors.username && <p className="text-[#D9534F] text-sm">Se necesita el nombre de usuario</p>}

            {/* Campo Email */}
            <label className="font-semibold text-[#2E3A46]">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-md border border-[#E1E5EA] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Correo electrónico"
            />
            {errors.email && <p className="text-[#D9534F] text-sm">Se necesita el email</p>}

            {/* Campo Contraseña */}
            <label className="font-semibold text-[#2E3A46]">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full bg-white text-[#2E3A46] px-4 py-3 sm:py-4 rounded-md border border-[#E1E5EA] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Contraseña"
            />
            {errors.password?.type === 'required' && <p className="text-[#D9534F] text-sm">Se necesita la contraseña</p>}
            {errors.password?.type === 'minLength' && <p className="text-[#D9534F] text-sm">La contraseña debe tener al menos 6 caracteres</p>}

            {/* Botón de envío */}
            <button
              type="submit"
              className="bg-[#4A90E2] hover:bg-[#357ABD] transition-transform transform hover:scale-105 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-md mt-4 sm:mt-6"
            >
              Registrarse
            </button>
          </form>

          {/* Enlace a login */}
          <p className="text-center text-[#2E3A46] mt-4 sm:mt-6">
            ¿Ya tiene una cuenta?{" "}
            <Link to="/login" className="text-[#4A90E2] hover:underline">Inicie sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;