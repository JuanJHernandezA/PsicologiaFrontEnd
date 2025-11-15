import { useState } from "react";
import Navbar from "../components/Navbar";
import { crearCita, type DateAppointment } from "../api";
import { useApi } from "../context/ApiContext";

export default function Agendar() {
  const { addNotification, startLoading, stopLoading } = useApi();
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    email: "",
    telefono: "",
    motivo: "",
    fecha: "",
    hora: "",
  });

  const [idPsicologo] = useState(1);
  const [idCliente] = useState(1); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha || !formData.hora) {
      addNotification('error', 'Por favor selecciona una fecha y hora');
      return;
    }

    if (!formData.nombre || !formData.email) {
      addNotification('error', 'Por favor completa todos los campos obligatorios');
      return;
    }


    const [hora, minutos] = formData.hora.split(':').map(Number);
    const horaInicio = `${String(hora).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
    const horaFinNum = (hora + 1) % 24;
    const horaFin = `${String(horaFinNum).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

    const nuevaCita: DateAppointment = {
      idPsicologo,
      idCliente,
      fecha: formData.fecha,
      horaInicio,
      horaFin,
    };

    try {
      startLoading();
      await crearCita(nuevaCita);
      addNotification('success', '¡Cita agendada correctamente!');
      
      setFormData({
        nombre: "",
        codigo: "",
        email: "",
        telefono: "",
        motivo: "",
        fecha: "",
        hora: "",
      });
    } catch (error: any) {
      addNotification('error', error.message || 'Error al agendar la cita');
    } finally {
      stopLoading();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-red-600 p-12 text-white">
                <h1 className="text-3xl font-bold mb-6">Agenda tu Cita Psicológica</h1>
                <p className="mb-6">
                  Completa el formulario para solicitar una cita con nuestros profesionales. 
                  Nos pondremos en contacto contigo para confirmar la fecha y hora.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Ubicación</h3>
                      <p className="text-sm text-white/80">Edificio de Bienestar Universitario, Piso 2</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Horario de Atención</h3>
                      <p className="text-sm text-white/80">Lunes a Viernes, 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Contacto</h3>
                      <p className="text-sm text-white/80">(602) 321-2100 / salud.mental@univalle.edu.co</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 p-12">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">Código Estudiantil</label>
                    <input 
                      type="text" 
                      id="codigo"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Ej: 2045678"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="correo@correounivalle.edu.co"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Ej: 3001234567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">Motivo de Consulta</label>
                    <textarea 
                      id="motivo"
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      rows={3} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Describe brevemente el motivo de tu consulta"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha Preferida *</label>
                    <input 
                      type="date" 
                      id="fecha"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      min={today}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">Hora Preferida *</label>
                    <select 
                      id="hora"
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Selecciona una hora</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Solicitar Cita
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
