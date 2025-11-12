import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-r from-red-600 to-red-800 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/src/assets/images/hero-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Servicio de Salud Mental Universitario
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Brindamos apoyo psicológico a toda la comunidad universitaria. Tu bienestar mental es nuestra prioridad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/agendar" className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all text-center">
                Agendar Cita
              </a>
              <a href="/gestion" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-center">
                Gestionar Citas
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Servicios Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una variedad de servicios de apoyo psicológico para ayudarte a mantener una buena salud mental durante tu vida universitaria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Servicio 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Terapia Individual</h3>
              <p className="text-gray-600">
                Sesiones personalizadas con profesionales capacitados para abordar tus necesidades específicas.
              </p>
            </div>
            
            {/* Servicio 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Terapia Grupal</h3>
              <p className="text-gray-600">
                Grupos de apoyo facilitados por profesionales donde puedes compartir experiencias y aprender de otros.
              </p>
            </div>
            
            {/* Servicio 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Talleres y Recursos</h3>
              <p className="text-gray-600">
                Talleres educativos y recursos para ayudarte a desarrollar habilidades de afrontamiento y resiliencia.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Psicólogos Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Equipo</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Contamos con profesionales altamente calificados y comprometidos con tu bienestar mental.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Psicólogo 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img 
                src="/src/assets/images/psicologo-1.jpg" 
                alt="Psicólogo" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Dra. Jhoana Castaño Jejen</h3>
                <p className="text-gray-500 mb-4">Psicóloga Clínica</p>
                <p className="text-gray-600">
                  Especialista en terapia cognitivo-conductual con más de 10 años de experiencia en entornos universitarios.
                </p>
              </div>
            </div>
            
            {/* Psicólogo 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img 
                src="/src/assets/images/psicologo-2.jpg" 
                alt="Psicólogo" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Dr. Cristian Rivera Torres</h3>
                <p className="text-gray-500 mb-4">Psicólogo Educativo</p>
                <p className="text-gray-600">
                  Especializado en problemas de aprendizaje y adaptación al entorno universitario.
                </p>
              </div>
            </div>
            
            {/* Psicólogo 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <img 
                src="/src/assets/images/psicologo-3.jpg" 
                alt="Psicólogo" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Dra. Williana Alexandra Franco</h3>
                <p className="text-gray-500 mb-4">Psicóloga Social</p>
                <p className="text-gray-600">
                  Experta en dinámicas grupales y resolución de conflictos en ambientes académicos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Servicio de Salud Mental</h3>
              <p className="text-gray-400">
                Universidad del Valle<br />
                Calle 13 #100-00<br />
                Cali, Colombia
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
                <li><a href="/agendar" className="text-gray-400 hover:text-white transition-colors">Agendar Cita</a></li>
                <li><a href="/gestion" className="text-gray-400 hover:text-white transition-colors">Gestión de Citas</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Teléfono: (602) 321-2100</li>
                <li className="text-gray-400">Email: salud.mental@univalle.edu.co</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
              <p className="text-gray-400">
                Lunes a Viernes<br />
                8:00 AM - 6:00 PM
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Universidad del Valle. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}