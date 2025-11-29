import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useApi } from "../context/ApiContext";

export default function Gestion() {
  const { addNotification } = useApi();
  const [activeTab, setActiveTab] = useState<"citas" | "horarios">("citas");
  const [availability, setAvailability] = useState([
    { day: "Lunes", working: true, start: "08:00", end: "12:00" },
    { day: "Martes", working: true, start: "08:00", end: "12:00" },
    { day: "Miércoles", working: true, start: "08:00", end: "12:00" },
    { day: "Jueves", working: true, start: "08:00", end: "12:00" },
    { day: "Viernes", working: true, start: "08:00", end: "12:00" },
    { day: "Sábado", working: false, start: "", end: "" },
    { day: "Domingo", working: false, start: "", end: "" },
  ]);

  type Status = "Confirmada" | "Pendiente" | "Cancelada";
  const statusStyle: Record<Status, string> = {
    Confirmada: "bg-green-100 text-green-800",
    Pendiente: "bg-yellow-100 text-yellow-800",
    Cancelada: "bg-red-100 text-red-800",
  };

  const [appointments, setAppointments] = useState([
    { id: "#12345", name: "Juan Pérez", date: "2025-12-15", time: "10:00", psychologist: "Dra. María Rodríguez", status: "Confirmada" as Status },
    { id: "#12346", name: "Ana Gómez", date: "2025-12-18", time: "14:00", psychologist: "Dr. Carlos Mendoza", status: "Pendiente" as Status },
    { id: "#12347", name: "Carlos Martínez", date: "2025-12-20", time: "09:00", psychologist: "Dra. Ana Gómez", status: "Cancelada" as Status },
  ]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ date: string; time: string; status: Status; } | null>(null);

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;
  const selectedDay = useMemo(() => {
    if (!draft?.date) return null;
    const d = new Date(draft.date);
    if (isNaN(d.getTime())) return null;
    return dayNames[d.getDay()];
  }, [draft?.date]);

  const errors = useMemo(() => {
    const out: Record<string, string> = {};
    if (!draft) return out;
    const today = new Date();
    const selected = new Date(draft.date);
    if (isNaN(selected.getTime())) out.date = "Fecha inválida";
    else {
      const selectedMid = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
      const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (selectedMid < todayMid) out.date = "No puede ser en el pasado";
    }
    if (!draft.time) out.time = "Hora requerida";
    else {
      const [hh, mm] = draft.time.split(":");
      const h = Number(hh);
      const m = Number(mm);
      if (Number.isNaN(h) || Number.isNaN(m)) out.time = "Hora inválida";
      if (h < 8 || h > 17) out.time = "Debe ser entre 8:00 y 17:00";
      const todayStr = new Date().toISOString().slice(0, 10);
      if (draft.date === todayStr) {
        const now = new Date();
        const candidate = new Date();
        candidate.setHours(h, m, 0, 0);
        if (candidate <= now) out.time = "Selecciona una hora futura";
      }
    }
    if (selectedDay) {
      const availItem = availability.find(a => a.day === selectedDay);
      if (availItem && !availItem.working) out.date = "El día seleccionado no está en tu horario";
    }
    if (editingIndex !== null) {
      const ap = appointments[editingIndex];
      const noChanges = ap.date === draft.date && ap.time === draft.time && ap.status === draft.status;
      if (noChanges) out.general = "No hay cambios";
    }
    return out;
  }, [draft, availability, selectedDay, editingIndex, appointments]);

  const openEdit = (idx: number) => {
    const ap = appointments[idx];
    setEditingIndex(idx);
    setDraft({ date: ap.date, time: ap.time, status: ap.status });
  };

  const closeEdit = () => {
    setEditingIndex(null);
    setDraft(null);
  };

  const saveEdit = () => {
    if (!draft || Object.keys(errors).length > 0 || editingIndex === null) return;
    const next = [...appointments];
    next[editingIndex] = { ...next[editingIndex], ...draft };
    setAppointments(next);
    addNotification("success", "Cita actualizada (solo visual)");
    closeEdit();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Citas</h1>
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab("citas")}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === "citas"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Citas
              </button>
              <button
                onClick={() => setActiveTab("horarios")}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === "horarios"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Horarios
              </button>
            </div>

            {activeTab === "citas" && (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Buscar Cita</h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="Código estudiantil o correo electrónico"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
                      Buscar
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Psicólogo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((ap, idx) => (
                        <tr key={ap.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ap.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ap.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ap.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ap.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ap.psychologist}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle[ap.status]}`}>{ap.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button onClick={() => openEdit(idx)} className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                            <button className="text-red-600 hover:text-red-900">Cancelar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editingIndex !== null && draft && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Editar cita {appointments[editingIndex].id}</h3>
                        <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700">✕</button>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input
                              type="date"
                              value={draft.date}
                              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                            />
                            {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                            <select
                              value={draft.time}
                              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                          <select
                            value={draft.status}
                            onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                          >
                            <option value="Confirmada">Confirmada</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                        </div>
                        {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}
                        <div className="flex justify-end gap-2">
                          <button onClick={closeEdit} className="px-4 py-2 rounded-md border">Cerrar</button>
                          <button onClick={saveEdit} disabled={Object.keys(errors).length > 0} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "horarios" && (
              <>
                <h2 className="text-xl font-semibold mb-6">Horarios Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availability.map((item, idx) => (
                    <div key={item.day} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium">{item.day}</span>
                        <button
                          onClick={() => {
                            const next = [...availability];
                            next[idx] = { ...next[idx], working: !next[idx].working };
                            setAvailability(next);
                          }}
                          className={`px-3 py-1 text-sm rounded-full ${
                            item.working ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.working ? "Trabaja" : "No trabaja"}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Inicio</label>
                          <input
                            type="time"
                            value={item.start}
                            disabled={!item.working}
                            onChange={(e) => {
                              const next = [...availability];
                              next[idx] = { ...next[idx], start: e.target.value };
                              setAvailability(next);
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Fin</label>
                          <input
                            type="time"
                            value={item.end}
                            disabled={!item.working}
                            onChange={(e) => {
                              const next = [...availability];
                              next[idx] = { ...next[idx], end: e.target.value };
                              setAvailability(next);
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Guardar cambios</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
