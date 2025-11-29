import '../index.css'
import { useEffect, useState } from 'react'
import { generateToken } from '../api'
import { useNavigate } from 'react-router-dom'
import { useApiWithAuth } from '../hooks/useApiWithAuth'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { handleApiCall, login, isAuthenticated } = useApiWithAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = await handleApiCall(
            async () => generateToken(email, password),
            'Inicio de sesión exitoso'
        )
        
        if (token) {
            login(token)
            navigate('/')
        }
    }

    return (
      <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-red-600 to-red-800 overflow-hidden py-8 px-4 sm:py-12 sm:px-6 lg:py-20">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/src/assets/images/hero-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-xl z-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Inicia Sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" htmlFor="email">Correo electrónico</label>
              <input 
                className="w-full p-2 sm:p-2.5 lg:p-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" 
                type="email" 
                id="email" 
                name="email" 
                placeholder="tucorreo@ejemplo.com"
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" htmlFor="password">Contraseña</label>
              <input 
                className="w-full p-2 sm:p-2.5 lg:p-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition" 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Tu contraseña"
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
              <a href="/registro" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline transition text-center sm:text-left">¿No tienes una cuenta?</a>
              <a href="/recuperarContrasena" className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:underline transition text-center sm:text-left">¿Olvidaste tu contraseña?</a>
            </div>
            <button className="w-full bg-red-600 text-white p-2.5 sm:p-3 text-sm sm:text-base rounded-md hover:bg-red-700 transition font-medium shadow-md hover:shadow-lg" type="submit">Iniciar Sesión</button>
          </form>
        </div>  
      </section>
    );
}

export default Login;