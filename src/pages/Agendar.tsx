import { useState } from "react";
import Navbar from "../components/Navbar";
import { crearCita, filtrarDisponibilidades, type DateAppointment, type Disponibilidad } from "../api";
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
  const [availabilityFilters, setAvailabilityFilters] = useState({
    idPsicologo: "1",
    fecha: "",
    mes: "",
    anio: new Date().getFullYear().toString(),
  });
  const [availabilityResults, setAvailabilityResults] = useState<Disponibilidad[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1].map(String);
  const monthOptions = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAvailabilityFilters(prev => ({
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

    const nuevaCita: Omit<DateAppointment, "id"> = {
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

  const handleConsultarDisponibilidad = async () => {
    if (!availabilityFilters.idPsicologo) {
      addNotification('error', 'Ingresa el ID del psicólogo para filtrar');
      return;
    }

    const filtros: {
      idPsicologo: number
      fecha?: string
      mes?: number
      anio?: number
    } = {
      idPsicologo: Number(availabilityFilters.idPsicologo),
    };

    if (availabilityFilters.fecha) {
      filtros.fecha = availabilityFilters.fecha;
    }

    if (availabilityFilters.mes) {
      filtros.mes = Number(availabilityFilters.mes);
    }

    if (availabilityFilters.anio) {
      filtros.anio = Number(availabilityFilters.anio);
    }

    try {
      setIsCheckingAvailability(true);
      const resultados = await filtrarDisponibilidades(filtros);
      setAvailabilityResults(resultados);

      if (resultados.length === 0) {
        addNotification('info', 'No hay horarios disponibles con los filtros seleccionados');
      }
    } catch (error: any) {
      addNotification('error', error.message || 'No se pudieron consultar las disponibilidades');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const formatFechaLegible = (fecha: string) => {
    if (!fecha) return '';
    const date = new Date(`${fecha}T00:00:00`);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatHora = (hora: string) => hora?.slice(0, 5) ?? '';

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

          <div className="mt-10 bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col gap-10 md:flex-row">
              <div className="md:w-1/3 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Consulta de Disponibilidad</h2>
                  <p className="text-sm text-gray-600">
                    Filtra los horarios disponibles por psicólogo, un día específico o por todo un mes.
                    Combina los filtros según necesites.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="filtro-id" className="block text-sm font-medium text-gray-700 mb-1">ID del Psicólogo *</label>
                    <input
                      id="filtro-id"
                      name="idPsicologo"
                      type="number"
                      min={1}
                      value={availabilityFilters.idPsicologo}
                      onChange={handleAvailabilityFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Ej: 1"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="filtro-fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha específica</label>
                    <input
                      id="filtro-fecha"
                      name="fecha"
                      type="date"
                      value={availabilityFilters.fecha}
                      onChange={handleAvailabilityFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por mes</label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <select
                        name="mes"
                        value={availabilityFilters.mes}
                        onChange={handleAvailabilityFilterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Sin filtro</option>
                        {monthOptions.map(mes => (
                          <option key={mes.value} value={mes.value}>{mes.label}</option>
                        ))}
                      </select>
                      <select
                        name="anio"
                        value={availabilityFilters.anio}
                        onChange={handleAvailabilityFilterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Si seleccionas un mes se utilizará el año indicado.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConsultarDisponibilidad}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCheckingAvailability}
                >
                  {isCheckingAvailability ? 'Consultando...' : 'Consultar disponibilidad'}
                </button>
              </div>

              <div className="md:flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Horarios disponibles</h3>
                    <p className="text-sm text-gray-500">
                      {availabilityResults.length > 0
                        ? `Encontramos ${availabilityResults.length} disponibilidad(es) para tus filtros.`
                        : 'Usa los filtros para revisar los horarios disponibles en tiempo real.'}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  {isCheckingAvailability ? (
                    <div className="p-6 text-center text-sm text-gray-500">Consultando disponibilidad...</div>
                  ) : availabilityResults.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">
                      No hay horarios para mostrar. Ajusta los filtros y vuelve a intentarlo.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora inicio</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora fin</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {availabilityResults.map((disp) => (
                            <tr key={disp.id ?? `${disp.fecha}-${disp.horaInicio}-${disp.horaFin}`}>
                              <td className="px-4 py-3 text-sm text-gray-900 capitalize">{formatFechaLegible(disp.fecha)}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{formatHora(disp.horaInicio)}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{formatHora(disp.horaFin)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
