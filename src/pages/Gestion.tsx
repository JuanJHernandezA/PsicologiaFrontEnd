import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { obtenerTodasLasCitas, cancelarCita, modificarCita, obtenerDisponibilidades, obtenerTodasLasDisponibilidades, actualizarDisponibilidad, crearDisponibilidad, crearDisponibilidadesMasivas, type DateAppointment, type Disponibilidad } from "../api";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";


export default function Gestion() {
  const { addNotification, startLoading, stopLoading } = useApi();
  const { role, user } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState<"citas" | "disponibilidad">("citas");
  const [citas, setCitas] = useState<DateAppointment[]>([]);
  const [citasFiltradas, setCitasFiltradas] = useState<DateAppointment[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  
  // Estados para disponibilidad
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
  const [cargandoDisponibilidades, setCargandoDisponibilidades] = useState(false);
  const [filtroPsicologo, setFiltroPsicologo] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [disponibilidadEditando, setDisponibilidadEditando] = useState<Disponibilidad | null>(null);
  const [formularioEdicion, setFormularioEdicion] = useState({
    idPsicologo: "",
    fecha: "",
    horaInicio: "",
    horaFin: ""
  });

  // Formulario para crear disponibilidad propia (psicólogo)
  const [newFecha, setNewFecha] = useState("");
  const [newHoraInicio, setNewHoraInicio] = useState("");
  const [newHoraFin, setNewHoraFin] = useState("");
  const [bulkFechaInicio, setBulkFechaInicio] = useState("");
  const [bulkFechaFin, setBulkFechaFin] = useState("");
  const [bulkHoraInicio, setBulkHoraInicio] = useState("");
  const [bulkHoraFin, setBulkHoraFin] = useState("");
  const [diasSemana, setDiasSemana] = useState<{[k: number]: boolean}>({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 0: false });
  const [creatingSingle, setCreatingSingle] = useState(false);
  const [creatingBulk, setCreatingBulk] = useState(false);

  const [citaEditando, setCitaEditando] = useState<DateAppointment | null>(null);
  const [formularioEdicionCita, setFormularioEdicionCita] = useState({
    idPsicologo: "",
    idCliente: "",
    fecha: "",
    horaInicio: "",
    horaFin: ""
  });

  useEffect(() => {
    cargarCitas();
  }, []);

  useEffect(() => {
    if (seccionActiva === "disponibilidad") {
      cargarTodasLasDisponibilidades();
    }
  }, [seccionActiva]);

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
    // Dividir la fecha para evitar problemas de zona horaria
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
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

  const iniciarEdicionCita = (cita: DateAppointment) => {
    setCitaEditando(cita);
    setFormularioEdicionCita({
      idPsicologo: cita.idPsicologo.toString(),
      idCliente: cita.idCliente.toString(),
      fecha: cita.fecha,
      horaInicio: cita.horaInicio,
      horaFin: cita.horaFin
    });
  };

  const cancelarEdicionCita = () => {
    setCitaEditando(null);
    setFormularioEdicionCita({
      idPsicologo: "",
      idCliente: "",
      fecha: "",
      horaInicio: "",
      horaFin: ""
    });
  };

  const handleModificarCita = async () => {
    if (!citaEditando?.id) return;

    if (!formularioEdicionCita.idPsicologo || !formularioEdicionCita.idCliente || 
        !formularioEdicionCita.fecha || !formularioEdicionCita.horaInicio || 
        !formularioEdicionCita.horaFin) {
      addNotification("error", "Todos los campos son requeridos");
      return;
    }

    try {
      startLoading();
      const citaModificada: DateAppointment = {
        id: citaEditando.id,
        idPsicologo: Number(formularioEdicionCita.idPsicologo),
        idCliente: Number(formularioEdicionCita.idCliente),
        fecha: formularioEdicionCita.fecha,
        horaInicio: formularioEdicionCita.horaInicio,
        horaFin: formularioEdicionCita.horaFin
      };

      await modificarCita(citaEditando.id, citaModificada);
      addNotification("success", "Cita modificada correctamente");
      cancelarEdicionCita();
      await cargarCitas();
    } catch (error: any) {
      addNotification("error", error.message || "Error al modificar la cita");
    } finally {
      stopLoading();
    }
  };

  const cargarTodasLasDisponibilidades = async () => {
    try {
      setCargandoDisponibilidades(true);
      startLoading();
      if (role === 'Psicologo' && user?.id) {
        const disp = await obtenerDisponibilidades(user.id);
        setDisponibilidades(disp);
        setFiltroPsicologo(String(user.id));
      } else {
        const disp = await obtenerTodasLasDisponibilidades();
        setDisponibilidades(disp);
      }
    } catch (error: any) {
      addNotification("error", error.message || "Error al cargar las disponibilidades");
    } finally {
      setCargandoDisponibilidades(false);
      stopLoading();
    }
  };

  const cargarDisponibilidades = async () => {
    try {
      setCargandoDisponibilidades(true);
      startLoading();
      
      // Si hay filtros, usarlos; si no, cargar todas
      let idPsicologoFiltro = filtroPsicologo ? Number(filtroPsicologo) : undefined;
      const fechaFiltro = filtroFecha || undefined;
      
      // En caso de rol Psicologo, forzar filtro por su propio ID
      if (role === 'Psicologo' && user?.id) {
        idPsicologoFiltro = user.id;
        setFiltroPsicologo(String(user.id));
      }
      
      if (idPsicologoFiltro !== undefined || fechaFiltro !== undefined) {
        const disp = await obtenerDisponibilidades(idPsicologoFiltro, fechaFiltro);
        setDisponibilidades(disp);
      } else {
        const disp = await obtenerTodasLasDisponibilidades();
        setDisponibilidades(disp);
      }
    } catch (error: any) {
      addNotification("error", error.message || "Error al cargar las disponibilidades");
    } finally {
      setCargandoDisponibilidades(false);
      stopLoading();
    }
  };

  const iniciarEdicion = (disp: Disponibilidad) => {
    setDisponibilidadEditando(disp);
    setFormularioEdicion({
      idPsicologo: disp.idPsicologo.toString(),
      fecha: disp.fecha,
      horaInicio: disp.horaInicio,
      horaFin: disp.horaFin
    });
  };

  const cancelarEdicion = () => {
    setDisponibilidadEditando(null);
    setFormularioEdicion({
      idPsicologo: "",
      fecha: "",
      horaInicio: "",
      horaFin: ""
    });
  };

  const handleActualizarDisponibilidad = async () => {
    if (!disponibilidadEditando?.id) return;

    if (!formularioEdicion.idPsicologo || !formularioEdicion.fecha || 
        !formularioEdicion.horaInicio || !formularioEdicion.horaFin) {
      addNotification("error", "Todos los campos son requeridos");
      return;
    }

    try {
      startLoading();
      const disponibilidadActualizada: Disponibilidad = {
        id: disponibilidadEditando.id,
        idPsicologo: Number(formularioEdicion.idPsicologo),
        fecha: formularioEdicion.fecha,
        horaInicio: formularioEdicion.horaInicio,
        horaFin: formularioEdicion.horaFin
      };

      await actualizarDisponibilidad(disponibilidadEditando.id, disponibilidadActualizada);
      addNotification("success", "Disponibilidad actualizada correctamente");
      cancelarEdicion();
      // Recargar todas las disponibilidades después de actualizar
      await cargarTodasLasDisponibilidades();
    } catch (error: any) {
      addNotification("error", error.message || "Error al actualizar la disponibilidad");
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

  // Creación de disponibilidad (día único)
  const crearDisponibilidadPropia = async () => {
    if (!(role === 'Psicologo' && user?.id)) {
      addNotification('error', 'Solo psicólogos autenticados pueden crear su disponibilidad');
      return;
    }
    if (!newFecha || !newHoraInicio || !newHoraFin) {
      addNotification('error', 'Completa fecha, hora inicio y hora fin');
      return;
    }
    try {
      setCreatingSingle(true);
      startLoading();
      await crearDisponibilidad({
        idPsicologo: user.id,
        fecha: newFecha,
        horaInicio: newHoraInicio,
        horaFin: newHoraFin,
      });
      addNotification('success', 'Disponibilidad creada');
      setNewFecha('');
      setNewHoraInicio('');
      setNewHoraFin('');
      await cargarTodasLasDisponibilidades();
    } catch (error: any) {
      addNotification('error', error.message || 'Error al crear disponibilidad');
    } finally {
      setCreatingSingle(false);
      stopLoading();
    }
  };

  // Creación masiva en rango de fechas y días seleccionados
  const crearDisponibilidadesPorRango = async () => {
    if (!(role === 'Psicologo' && user?.id)) {
      addNotification('error', 'Solo psicólogos autenticados pueden crear su disponibilidad');
      return;
    }
    if (!bulkFechaInicio || !bulkFechaFin || !bulkHoraInicio || !bulkHoraFin) {
      addNotification('error', 'Completa fechas y horas del rango');
      return;
    }
    const diasSeleccionados = Object.entries(diasSemana)
      .filter(([_, v]) => v)
      .map(([k]) => Number(k));
    if (diasSeleccionados.length === 0) {
      addNotification('error', 'Selecciona al menos un día de la semana');
      return;
    }
    try {
      setCreatingBulk(true);
      startLoading();
      // Si se seleccionan todos los días, usamos el endpoint masivo del backend
      if (diasSeleccionados.length === 7) {
        await crearDisponibilidadesMasivas(
          Number(user.id),
          bulkFechaInicio,
          bulkFechaFin,
          bulkHoraInicio,
          bulkHoraFin,
        );
      } else {
        // De lo contrario, generamos fechas del rango que coincidan con los días seleccionados
        const start = new Date(bulkFechaInicio);
        const end = new Date(bulkFechaFin);
        const toYMD = (d: Date) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const da = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${da}`;
        };
        const creations: Promise<any>[] = [];
        for (let d = new Date(start.getTime()); d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
          const dow = d.getDay(); // 0..6
          if (diasSeleccionados.includes(dow)) {
            creations.push(
              crearDisponibilidad({
                idPsicologo: Number(user.id),
                fecha: toYMD(d),
                horaInicio: bulkHoraInicio,
                horaFin: bulkHoraFin,
              })
            );
          }
        }
        await Promise.all(creations);
      }
      addNotification('success', 'Disponibilidades creadas');
      setBulkFechaInicio('');
      setBulkFechaFin('');
      setBulkHoraInicio('');
      setBulkHoraFin('');
      await cargarTodasLasDisponibilidades();
    } catch (error: any) {
      addNotification('error', error.message || 'Error al crear disponibilidades');
    } finally {
      setCreatingBulk(false);
      stopLoading();
    }
  };

  const obtenerEstado = (fecha: string, horaFin: string) => {
    // Dividir la fecha para evitar problemas de zona horaria
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaCita = new Date(year, month - 1, day, ...horaFin.split(':').map(Number));
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
          <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Citas y Disponibilidades</h1>
          
          {/* Botones para alternar entre secciones */}
          <div className="flex gap-4 mb-6 justify-center">
            <button
              onClick={() => setSeccionActiva("citas")}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                seccionActiva === "citas"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Citas
            </button>
            <button
              onClick={() => setSeccionActiva("disponibilidad")}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                seccionActiva === "disponibilidad"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Disponibilidad
            </button>
          </div>

          {/* Sección de Citas */}
          {seccionActiva === "citas" && (
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
                              onClick={() => iniciarEdicionCita(cita)}
                            >
                              Editar
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleCancelarCita(cita.id!)}
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

            {citaEditando && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Editar Cita #{citaEditando.id}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Psicólogo
                    </label>
                    <input
                      type="number"
                      value={formularioEdicionCita.idPsicologo}
                      onChange={(e) => setFormularioEdicionCita({ ...formularioEdicionCita, idPsicologo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Cliente
                    </label>
                    <input
                      type="number"
                      value={formularioEdicionCita.idCliente}
                      onChange={(e) => setFormularioEdicionCita({ ...formularioEdicionCita, idCliente: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={formularioEdicionCita.fecha}
                      onChange={(e) => setFormularioEdicionCita({ ...formularioEdicionCita, fecha: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      value={formularioEdicionCita.horaInicio}
                      onChange={(e) => setFormularioEdicionCita({ ...formularioEdicionCita, horaInicio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      value={formularioEdicionCita.horaFin}
                      onChange={(e) => setFormularioEdicionCita({ ...formularioEdicionCita, horaFin: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleModificarCita}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={cancelarEdicionCita}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          {/* Sección de Disponibilidad */}
          {seccionActiva === "disponibilidad" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Disponibilidades</h2>
                  <button
                    onClick={cargarTodasLasDisponibilidades}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    Actualizar
                  </button>
                </div>
                {role === 'Psicologo' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-md">
                      <h3 className="text-base font-semibold mb-2">Crear disponibilidad (día único)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">ID Psicólogo</label>
                          <input type="text" value={user?.id ?? ''} disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Fecha</label>
                          <input type="date" value={newFecha} onChange={(e) => setNewFecha(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Hora inicio</label>
                            <input type="time" value={newHoraInicio} onChange={(e) => setNewHoraInicio(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Hora fin</label>
                            <input type="time" value={newHoraFin} onChange={(e) => setNewHoraFin(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                          </div>
                        </div>
                      </div>
                      <button onClick={crearDisponibilidadPropia} disabled={creatingSingle} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                        {creatingSingle ? 'Creando...' : 'Crear'}
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-md">
                      <h3 className="text-base font-semibold mb-2">Crear por rango de fechas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">ID Psicólogo</label>
                          <input type="text" value={user?.id ?? ''} disabled className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Fecha inicio</label>
                            <input type="date" value={bulkFechaInicio} onChange={(e) => setBulkFechaInicio(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Fecha fin</label>
                            <input type="date" value={bulkFechaFin} onChange={(e) => setBulkFechaFin(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Hora inicio</label>
                            <input type="time" value={bulkHoraInicio} onChange={(e) => setBulkHoraInicio(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Hora fin</label>
                            <input type="time" value={bulkHoraFin} onChange={(e) => setBulkHoraFin(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Días de la semana</label>
                          <div className="grid grid-cols-7 gap-2">
                            {[{k:1,l:'L'},{k:2,l:'M'},{k:3,l:'X'},{k:4,l:'J'},{k:5,l:'V'},{k:6,l:'S'},{k:0,l:'D'}].map(d => (
                              <label key={d.k} className="flex items-center gap-2">
                                <input type="checkbox" checked={!!diasSemana[d.k]} onChange={(e) => setDiasSemana(prev => ({ ...prev, [d.k]: e.target.checked }))} />
                                <span>{d.l}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button onClick={crearDisponibilidadesPorRango} disabled={creatingBulk} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                        {creatingBulk ? 'Creando...' : 'Crear en rango'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros (opcionales)</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="number"
                        placeholder="ID Psicólogo (opcional)"
                        value={filtroPsicologo}
                        onChange={(e) => setFiltroPsicologo(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <input
                        type="date"
                        placeholder="Fecha (opcional)"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <button
                        onClick={cargarDisponibilidades}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Filtrar
                      </button>
                      <button
                        onClick={() => {
                          setFiltroPsicologo("");
                          setFiltroFecha("");
                          cargarTodasLasDisponibilidades();
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {cargandoDisponibilidades ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="mt-4 text-gray-600">Cargando disponibilidades...</p>
                </div>
              ) : disponibilidades.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No hay disponibilidades registradas</p>
                  <p className="text-gray-500 text-sm mt-2">Las disponibilidades aparecerán aquí una vez que sean creadas</p>
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
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {disponibilidades.map((disp) => (
                        <tr key={disp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{disp.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {disp.idPsicologo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearFecha(disp.fecha)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearHora(disp.horaInicio)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatearHora(disp.horaFin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => iniciarEdicion(disp)}
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Modal/Formulario de Edición */}
              {disponibilidadEditando && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Editar Disponibilidad #{disponibilidadEditando.id}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Psicólogo
                      </label>
                      <input
                        type="number"
                        value={role === 'Psicologo' && user?.id ? user.id : formularioEdicion.idPsicologo}
                        onChange={(e) => setFormularioEdicion({ ...formularioEdicion, idPsicologo: e.target.value })}
                        disabled={role === 'Psicologo'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={formularioEdicion.fecha}
                        onChange={(e) => setFormularioEdicion({ ...formularioEdicion, fecha: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora Inicio
                      </label>
                      <input
                        type="time"
                        value={formularioEdicion.horaInicio}
                        onChange={(e) => setFormularioEdicion({ ...formularioEdicion, horaInicio: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora Fin
                      </label>
                      <input
                        type="time"
                        value={formularioEdicion.horaFin}
                        onChange={(e) => setFormularioEdicion({ ...formularioEdicion, horaFin: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleActualizarDisponibilidad}
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={cancelarEdicion}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
