import { Link } from 'react-router-dom'

export default function Navbar() {
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
        
        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                Inicio
              </Link>
            </li>
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
            <li>
              <Link to="/gestion" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                Gestión de Citas
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-gray-800 hover:text-red-600 font-medium relative after:absolute after:bottom-[-5px] after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all hover:after:w-full">
                Administración
              </Link>
            </li>
          </ul>
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
