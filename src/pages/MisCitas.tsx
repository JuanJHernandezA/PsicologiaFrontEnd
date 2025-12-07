import { useMemo, useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import { obtenerCitasPorCliente, modificarCita, cancelarCita, listarPsicologos, type DateAppointment, type Usuario } from "../api";

export default function MisCitas() {
  const { addNotification } = useApi();
  const { user, role } = useAuth();

  // Estado de citas y selección
  const [citas, setCitas] = useState<DateAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCita, setSelectedCita] = useState<DateAppointment | null>(null);

  // Draft de reprogramación
  const [draftDate, setDraftDate] = useState<string>("");
  const [draftTime, setDraftTime] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Psicólogos reales para mostrar nombre en el resumen
  const [psicologos, setPsicologos] = useState<Usuario[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await listarPsicologos();
        setPsicologos(data);
      } catch (_) {
        // silencioso: si falla, se mostrará el ID del psicólogo
      }
    })();
  }, []);

  const loadData = useCallback(async () => {
    if (!user?.id || role !== 'Estudiante') return;
    try {
      setLoading(true);
      const data = await obtenerCitasPorCliente(Number(user.id));
      setCitas(data);
      // Si la cita seleccionada ya no existe, limpiamos selección
      if (selectedCita) {
        const stillThere = data.find(c => c.id === selectedCita.id);
        if (!stillThere) setSelectedCita(null);
      }
    } catch (err: any) {
      addNotification('error', err.message || 'Error cargando tus citas');
    } finally {
      setLoading(false);
    }
  }, [user?.id, role, addNotification, selectedCita]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helpers para hora
  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const selectedDay: string | null = useMemo(() => {
    const d = new Date(draftDate);
    if (isNaN(d.getTime())) return null;
    return dayNames[d.getDay()];
  }, [draftDate]);

  const timeToMinutes = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + mm;
  };
  const minutesToTime = (m: number) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  };
  const addMinutesToTime = (t: string, minutes: number) => minutesToTime(timeToMinutes(t) + minutes);

  // Validaciones solo de fecha/hora
  const errors = useMemo(() => {
    const out: Record<string, string> = {};
    if (!selectedCita) {
      out.general = "Selecciona una cita para editar o cancelar";
      return out;
    }
    const today = new Date();
    const selected = new Date(draftDate);
    if (isNaN(selected.getTime())) out.date = "Fecha inválida";
    else {
      const selectedMid = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
      const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (selectedMid < todayMid) out.date = "No puede ser en el pasado";
    }
    if (!draftTime) out.time = "Hora requerida";
    else {
      const [hh, mm] = draftTime.split(":");
      const h = Number(hh);
      const m = Number(mm);
      if (Number.isNaN(h) || Number.isNaN(m)) out.time = "Hora inválida";
      if (h < 8 || h > 17) out.time = "Debe ser entre 8:00 y 17:00";
      if (selected.toDateString() === today.toDateString()) {
        const now = new Date();
        const candidate = new Date();
        candidate.setHours(h, m, 0, 0);
        if (candidate <= now) out.time = "Selecciona una hora futura";
      }
    }
    return out;
  }, [draftDate, draftTime, selectedCita]);

  // Selección de cita
  const handleSelect = (cita: DateAppointment) => {
    setSelectedCita(cita);
    setDraftDate(cita.fecha);
    setDraftTime(cita.horaInicio);
  };

  const getPsychologistName = (id?: number) => {
    if (!id) return undefined;
    const p = psicologos.find((x) => x.id === id);
    return p ? `${p.name} ${p.lastName}` : undefined;
  };

  // Reprogramar (actualizar fecha/hora)
  const onUpdate = async () => {
    if (Object.keys(errors).length > 0 || !selectedCita?.id) return;
    try {
      setSaving(true);
      const durMin = timeToMinutes(selectedCita.horaFin) - timeToMinutes(selectedCita.horaInicio);
      const nuevoFin = addMinutesToTime(draftTime, Math.max(durMin, 0));
      const payload: DateAppointment = {
        idPsicologo: selectedCita.idPsicologo,
        idCliente: Number(user?.id),
        fecha: draftDate,
        horaInicio: draftTime,
        horaFin: nuevoFin,
      };
      await modificarCita(Number(selectedCita.id), payload);
      addNotification("success", "Cita actualizada correctamente");
      await loadData();
      const updated = { ...selectedCita, fecha: payload.fecha, horaInicio: payload.horaInicio, horaFin: payload.horaFin };
      setSelectedCita(updated);
    } catch (err: any) {
      addNotification("error", err.message || "Error al modificar la cita");
    } finally {
      setSaving(false);
    }
  };

  // Cancelar cita
  const onCancel = async () => {
    if (!selectedCita?.id) return;
    try {
      setCancelling(true);
      await cancelarCita(Number(selectedCita.id));
      addNotification("success", "Cita cancelada");
      await loadData();
      setSelectedCita(null);
      setDraftDate("");
      setDraftTime("");
    } catch (err: any) {
      addNotification("error", err.message || "Error al cancelar la cita");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Mis Citas</h1>

          {/* Lista de citas reales */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Citas asociadas a tu cuenta</h2>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Actualizando…' : 'Actualizar'}
              </button>
            </div>

            {citas.length === 0 ? (
              <p className="text-gray-600">No tienes citas registradas.</p>
            ) : (
              <ul className="space-y-3">
                {citas.map((cita) => (
                  <li
                    key={`${cita.id}-${cita.fecha}-${cita.horaInicio}`}
                    onClick={() => handleSelect(cita)}
                    className={`p-4 border rounded-lg flex items-start justify-between cursor-pointer transition-colors ${selectedCita?.id === cita.id ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'}`}
                  >
                    <div>
                      <p className="font-medium">{cita.fecha} · {cita.horaInicio} – {cita.horaFin}</p>
                      <p className="text-sm text-gray-500">Psicólogo: {getPsychologistName(cita.idPsicologo) ?? `ID ${cita.idPsicologo}`}</p>
                    </div>
                    <span className="text-xs text-gray-400">#{cita.id}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Resumen y acciones sobre la cita seleccionada */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen de la cita</h2>
              {selectedCita ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>ID</span><span className="font-medium">{selectedCita.id}</span></div>
                  <div className="flex justify-between"><span>Psicólogo</span><span className="font-medium">{getPsychologistName(selectedCita.idPsicologo) ?? `ID ${selectedCita.idPsicologo}`}</span></div>
                  <div className="flex justify-between"><span>Fecha</span><span className="font-medium">{selectedCita.fecha}</span></div>
                  <div className="flex justify-between"><span>Hora</span><span className="font-medium">{selectedCita.horaInicio} – {selectedCita.horaFin}</span></div>
                </div>
              ) : (
                <p className="text-gray-600">Selecciona una cita de la lista para ver su resumen.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Reprogramar / Cancelar</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva fecha</label>
                    <input
                      type="date"
                      value={draftDate}
                      onChange={(e) => setDraftDate(e.target.value)}
                      disabled={!selectedCita}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                    />
                    {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva hora</label>
                    <select
                      value={draftTime}
                      onChange={(e) => setDraftTime(e.target.value)}
                      disabled={!selectedCita}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
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
                    {errors.time && <p className="text-red-600 text-xs mt-1">{errors.time}</p>}
                  </div>
                </div>

                {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}

                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    onClick={onCancel}
                    disabled={!selectedCita || cancelling}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelando…' : 'Cancelar cita'}
                  </button>
                  <button
                    onClick={onUpdate}
                    disabled={Object.keys(errors).length > 0 || saving}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {saving ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

