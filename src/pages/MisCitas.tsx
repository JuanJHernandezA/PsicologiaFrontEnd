import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useApi } from "../context/ApiContext";

export default function MisCitas() {
  type PsychologistId = "ana-gomez" | "maria-rodriguez" | "carlos-mendoza";
  type DayName = "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";

  const psychologists: { id: PsychologistId; name: string }[] = [
    { id: "ana-gomez", name: "Dra. Ana Gómez" },
    { id: "maria-rodriguez", name: "Dra. María Rodríguez" },
    { id: "carlos-mendoza", name: "Dr. Carlos Mendoza" },
  ];

  const availabilityByPsychologist = useMemo<Record<PsychologistId, { days: Record<DayName, boolean> }>>(
    () => ({
      "ana-gomez": {
        days: { Lunes: true, Martes: true, Miércoles: false, Jueves: true, Viernes: true, Sábado: false, Domingo: false },
      },
      "maria-rodriguez": {
        days: { Lunes: true, Martes: false, Miércoles: true, Jueves: false, Viernes: true, Sábado: false, Domingo: false },
      },
      "carlos-mendoza": {
        days: { Lunes: false, Martes: true, Miércoles: true, Jueves: true, Viernes: false, Sábado: false, Domingo: false },
      },
    }),
    []
  );

  const initialAppointment = {
    id: "#A-2025-0001",
    psychologistId: "maria-rodriguez" as PsychologistId,
    name: "Estudiante Ejemplo",
    studentCode: "2045678",
    email: "estudiante@correounivalle.edu.co",
    phone: "3001234567",
    motive: "Consulta de orientación académica y manejo de estrés.",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
  };

  const { addNotification } = useApi();

  const [original, setOriginal] = useState(initialAppointment);
  const [draft, setDraft] = useState(initialAppointment);

  const dayNames: DayName[] = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as unknown as DayName[];

  const selectedDay: DayName | null = useMemo(() => {
    const d = new Date(draft.date);
    if (isNaN(d.getTime())) return null;
    const name = dayNames[d.getDay()];
    return name;
  }, [draft.date]);

  const errors = useMemo(() => {
    const out: Record<string, string> = {};
    if (!draft.name || draft.name.trim().length < 3) out.name = "Nombre inválido";
    if (!/^[0-9]{6,}$/.test(draft.studentCode)) out.studentCode = "Código inválido";
    if (!/^\S+@\S+\.\S+$/.test(draft.email)) out.email = "Correo inválido";
    if (!/^\d{10}$/.test(draft.phone)) out.phone = "Teléfono inválido";
    if (!draft.motive || draft.motive.trim().length < 10) out.motive = "Motivo muy corto";
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
      if (selected.toDateString() === today.toDateString()) {
        const now = new Date();
        const candidate = new Date();
        candidate.setHours(h, m, 0, 0);
        if (candidate <= now) out.time = "Selecciona una hora futura";
      }
    }
    if (selectedDay) {
      const avail = availabilityByPsychologist[draft.psychologistId].days[selectedDay];
      if (!avail) out.psychologistId = "El psicólogo no atiende ese día";
    }
    const noChanges =
      draft.psychologistId === original.psychologistId &&
      draft.date === original.date &&
      draft.time === original.time &&
      draft.motive === original.motive &&
      draft.email === original.email &&
      draft.phone === original.phone &&
      draft.name === original.name &&
      draft.studentCode === original.studentCode;
    if (noChanges) out.general = "No hay cambios";
    return out;
  }, [draft, original, selectedDay, availabilityByPsychologist]);

  const onSubmit = () => {
    if (Object.keys(errors).length > 0) return;
    setOriginal(draft);
    addNotification("success", "Cambios guardados (solo visual)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Mis Citas</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen de la cita</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>ID</span><span className="font-medium">{original.id}</span></div>
                <div className="flex justify-between"><span>Psicólogo</span><span className="font-medium">{psychologists.find(p => p.id === original.psychologistId)?.name}</span></div>
                <div className="flex justify-between"><span>Fecha</span><span className="font-medium">{original.date}</span></div>
                <div className="flex justify-between"><span>Hora</span><span className="font-medium">{original.time}</span></div>
                <div className="flex justify-between"><span>Motivo</span><span className="font-medium">{original.motive}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Editar Cita</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Psicólogo</label>
                  <select
                    value={draft.psychologistId}
                    onChange={(e) => setDraft({ ...draft, psychologistId: e.target.value as PsychologistId })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {psychologists.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                  {errors.psychologistId && <p className="text-red-600 text-xs mt-1">{errors.psychologistId}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <select
                      value={draft.time}
                      onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                  <textarea
                    rows={3}
                    value={draft.motive}
                    onChange={(e) => setDraft({ ...draft, motive: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.motive && <p className="text-red-600 text-xs mt-1">{errors.motive}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código Estudiantil</label>
                    <input
                      type="text"
                      value={draft.studentCode}
                      onChange={(e) => setDraft({ ...draft, studentCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    {errors.studentCode && <p className="text-red-600 text-xs mt-1">{errors.studentCode}</p>}
                  </div>
                </div>

                {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}

                <div className="flex justify-end mt-2">
                  <button
                    onClick={onSubmit}
                    disabled={Object.keys(errors).length > 0}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Guardar cambios
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

