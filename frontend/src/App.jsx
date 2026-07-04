import { BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router para manejo de rutas
import { AuthProvider } from './context/AuthContext'; // Contexto de autenticación
import { FontSizeProvider } from './context/FontSizeContext'; // Contexto para tamaño de fuente
import { EventProvider } from './context/EventsContext'; // Contexto para eventos
import { VideoProvider } from './context/VideosContext'; // Contexto para videos
import { BenefitsProvider } from './context/BenefitsContext'; // Contexto para beneficios

// Importamos las páginas de la aplicación
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import EventFormPage from './pages/EventFormPage';
import VideosPage from './pages/VideosPage';
import VideoFormPage from './pages/VideoFormPage';
import BenefitsPage from './pages/BenefitsPage'; 
import BenefitsFormPage from './pages/BenefitsFormPage'; 
import HomePage from './pages/HomePage';
import AboutUsPage from "./pages/AboutUsPage";
import GamePage from './pages/GamePage';
import UsersPage from './pages/UsersPage'; 
import NutritionPage from './pages/NutritionPage';

import ForgotPassword from './pages/ForgotPassword'; // Página para solicitar recuperación de contraseña
import PasswordReset from './pages/PasswordReset'; // Página para resetear contraseña con token

import ProtectedRoute from './ProtectedRoute'; // Componente para proteger rutas privadas

function App() {
  return (
    // Proveedores de contexto que envuelven toda la app
    <AuthProvider>
      <EventProvider>
        <VideoProvider>
          <BenefitsProvider>
            <FontSizeProvider>
              <BrowserRouter basename="/Mi-demo-web">
                <main className='container mx-auto px-10'>
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/register' element={<RegisterPage/>}/>
                    <Route path="/about-us" element={<AboutUsPage />} />

                    {/* Rutas de recuperación de contraseña (públicas) */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/password-reset/:id/:token" element={<PasswordReset />} />

                    {/* Rutas protegidas */}
                    <Route element={<ProtectedRoute/>}>
                      {/* Eventos */}
                      <Route path='/events' element={<EventsPage/>}/>
                      <Route path='/add-events' element={<EventFormPage/>}/>
                      <Route path='/events/:id' element={<EventFormPage/>}/>

                      {/* Videos */}
                      <Route path='/videos' element={<VideosPage/>}/>
                      <Route path='/add-videos' element={<VideoFormPage/>}/>
                      <Route path='/videos/:id' element={<VideoFormPage/>}/>

                      {/* Beneficios */}
                      <Route path='/benefits' element={<BenefitsPage/>}/>
                      <Route path='/add-benefits' element={<BenefitsFormPage/>}/>
                      <Route path='/benefits/:id' element={<BenefitsFormPage/>}/>

                      {/* Página de juego */}
                      <Route path='/game' element={<GamePage/>}/>

                      {/* Página de guia de nutrición */}
                      <Route path='/nutrition' element={<NutritionPage/>}/>

                      {/* Administración de usuarios */}
                      <Route path='/users' element={<UsersPage/>}/>
                    </Route>
                  </Routes>
                </main>
              </BrowserRouter>
            </FontSizeProvider>
          </BenefitsProvider>
        </VideoProvider>
      </EventProvider>
    </AuthProvider>
  );
}

export default App; // Exportamos el componente principal