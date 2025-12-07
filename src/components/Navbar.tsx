import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState, useCallback } from 'react'
import { listarNotificacionesPorCliente, listarNotificacionesPorPsicologo } from '../api'

export default function Navbar() {
  const { isAuthenticated, role, logout, user } = useAuth()
  const navigate = useNavigate()
  const [notifCount, setNotifCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const loadNotifCount = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !role) return
    try {
      setLoadingCount(true)
      if (role === 'Estudiante') {
        const list = await listarNotificacionesPorCliente(Number(user.id))
        setNotifCount(list.length)
      } else if (role === 'Psicologo') {
        const list = await listarNotificacionesPorPsicologo(Number(user.id))
        setNotifCount(list.length)
      } else {
        setNotifCount(0)
      }
    } catch (e) {
      // Silenciar errores de conteo para no afectar la navegación
      setNotifCount(0)
    } finally {
      setLoadingCount(false)
    }
  }, [isAuthenticated, user?.id, role])

  useEffect(() => {
    loadNotifCount()
  }, [loadNotifCount])

  useEffect(() => {
    const handler = () => loadNotifCount()
    window.addEventListener('notifications:updated', handler)
    return () => window.removeEventListener('notifications:updated', handler)
  }, [loadNotifCount])

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 text-red-600 font-bold text-lg">
          <img 
            src="https://kimi-web-img.moonshot.cn/img/losestudiantes.com/68d5fc7ebf59b60340716db87369f6779d61c20b.png" 
            alt="Logo Universidad del Valle" 
            className="h-10 w-auto"
          />
          <span>Servicio de Salud Mental</span>
        </Link>
        
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-8 items-center">
            <li>
              <Link to="/" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                Inicio
              </Link>
            </li>
            
            {/* Enlaces para Estudiantes */}
            {isAuthenticated && role === 'Estudiante' && (
              <>
                <li>
                  <Link to="/agendar" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                    Agendar Cita
                  </Link>
                </li>
                <li>
                  <Link to="/mis-citas" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                    Mis Citas
                  </Link>
                </li>
                <li className="relative">
                  <Link to="/notificaciones" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                    Notificaciones
                  </Link>
                  {notifCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {notifCount}
                    </span>
                  )}
                </li>
              </>
            )}
            
            {/* Enlaces para Psicólogos */}
            {isAuthenticated && role === 'Psicologo' && (
              <>
              <li>
                <Link to="/gestion" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                  Gestión de Citas
                </Link>
              </li>
              <li className="relative">
                <Link to="/notificaciones" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                  Notificaciones
                </Link>
                {notifCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {notifCount}
                  </span>
                )}
              </li>
              </>
            )}
            
            {/* Enlaces para Administradores */}
            {isAuthenticated && role === 'Administrador' && (
              <li>
                <Link to="/admin" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                  Administración
                </Link>
              </li>
            )}
          </ul>
          
          {/* Botón de login/logout */}
          <div className="ml-8 flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  {user?.name} {user?.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </nav>
        
        <button className="md:hidden text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  )
}
