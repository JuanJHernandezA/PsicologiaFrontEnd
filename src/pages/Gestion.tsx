import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { obtenerTodasLasCitas, obtenerCitasPorCliente,cancelarCita, type DateAppointment } from "../api";
import { useApi } from "../context/ApiContext";


export default function Gestion() {
  const { addNotification, startLoading, stopLoading } = useApi();
  const [citas, setCitas] = useState<DateAppointment[]>([]);
  const [citasFiltradas, setCitasFiltradas] = useState<DateAppointment[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === "") {
      setCitasFiltradas(citas);
    } else {
      setCitasFiltradas(citas);
    }
  }, [busqueda, citas]);

  const cargarCitas = async () => {
    try {
      setCargando(true);
      startLoading();
      const todasLasCitas = await obtenerTodasLasCitas();
      setCitas(todasLasCitas);
      setCitasFiltradas(todasLasCitas);
    } catch (error: any) {
      addNotification('error', error.message || 'Error al cargar las citas');
    } finally {
      setCargando(false);
      stopLoading();
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCancelarCita = async (id: number) => {
  const confirmar = window.confirm("¿Seguro que deseas cancelar esta cita?");
  if (!confirmar) return;

  try {
    startLoading();

    await cancelarCita(id);

    addNotification("success", "Cita cancelada correctamente");

    await cargarCitas();

  } catch (error: any) {
    addNotification("error", error.message || "Error al cancelar la cita");
  } finally {
    stopLoading();
  }
};


  const formatearHora = (hora: string) => {
    const [h, m] = hora.split(':');
    const horas = parseInt(h);
    const minutos = m;
    const periodo = horas >= 12 ? 'PM' : 'AM';
    const horas12 = horas % 12 || 12;
    return `${horas12}:${minutos} ${periodo}`;
  };

  const obtenerEstado = (fecha: string, horaFin: string) => {
    const fechaCita = new Date(`${fecha}T${horaFin}`);
    const ahora = new Date();
    
    if (fechaCita < ahora) {
      return { texto: 'Completada', color: 'bg-blue-100 text-blue-800' };
    }
    return { texto: 'Confirmada', color: 'bg-green-100 text-green-800' };
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Citas</h1>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Buscar Cita</h2>
                <button
                  onClick={cargarCitas}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                >
                  Actualizar
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Código estudiantil o correo electrónico" 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button 
                  onClick={() => cargarCitas()}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>
            
            {cargando ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600">Cargando citas...</p>
              </div>
            ) : citasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No hay citas registradas</p>
                <p className="text-gray-500 text-sm mt-2">Las citas aparecerán aquí una vez que sean agendadas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Psicólogo ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora Inicio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora Fin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {citasFiltradas.map((cita) => {
                      const estado = obtenerEstado(cita.fecha, cita.horaFin);
                      return (
                        <tr key={cita.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{cita.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cita.idCliente}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cita.idPsicologo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearFecha(cita.fecha)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearHora(cita.horaInicio)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearHora(cita.horaFin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estado.color}`}>
                              {estado.texto}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => addNotification('info', 'Función de edición próximamente')}
                            >
                              Editar
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleCancelarCita(cita.id)}
                            >
                              Cancelar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
