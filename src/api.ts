const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999'
const DATE_API_URL = import.meta.env.VITE_DATE_API_URL || 'http://localhost:9998'

type RegisterPayload = {
  name: string
  lastName: string
  birthDate: string // YYYY-MM-DD
  gender: 'M' | 'F' | 'Otro'
  phone: string
  studentCode?: string | null
  identityDocument: string
  email: string
  role: 'Estudiante' | 'Administrador' | 'Psicologo'
  password: string
}

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${API_URL}/auth/registerUser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.text()
}

export async function generateToken(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/generateToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.text()
}

export async function cancelarCita(id: number) {
  const response = await fetch(`http://localhost:8090/api/dates/cancelar/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error al cancelar la cita");
  }

  return await response.text();
}


export async function validateToken(token: string) {
  const res = await fetch(`${API_URL}/auth/validateToken?token=${encodeURIComponent(token)}`)
  if (!res.ok) throw new Error(await res.text())
  return res.text()
}

export function authHeader(token?: string) {
  const t = token ?? localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function getAllUsers() {
  const headers = authHeader() as HeadersInit
  const res = await fetch(`${API_URL}/admin/users`, {
    headers,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// Tipos para las citas
export type DateAppointment = {
  id: number;
  idPsicologo: number
  idCliente: number
  fecha: string // YYYY-MM-DD
  horaInicio: string // HH:mm
  horaFin: string // HH:mm
}

export type Disponibilidad = {
  id?: number
  idPsicologo: number
  fecha: string // YYYY-MM-DD
  horaInicio: string // HH:mm
  horaFin: string // HH:mm
}

// Funciones para gestionar citas
export async function crearCita(cita: DateAppointment) {
  const res = await fetch(`${DATE_API_URL}/api/dates/agendar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cita),
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Error al crear la cita')
  }
  return res.text()
}

export async function obtenerTodasLasCitas() {
  const res = await fetch(`${DATE_API_URL}/api/dates/todas`)
  if (!res.ok) throw new Error('Error al obtener las citas')
  return res.json() as Promise<DateAppointment[]>
}

export async function obtenerCitasPorCliente(idCliente: number) {
  const res = await fetch(`${DATE_API_URL}/api/dates/cliente/${idCliente}`)
  if (!res.ok) throw new Error('Error al obtener las citas del cliente')
  return res.json() as Promise<DateAppointment[]>
}

export async function obtenerCitasPorPsicologo(idPsicologo: number, fecha: string) {
  const res = await fetch(`${DATE_API_URL}/api/dates/citas?idPsicologo=${idPsicologo}&fecha=${fecha}`)
  if (!res.ok) throw new Error('Error al obtener las citas')
  return res.json() as Promise<DateAppointment[]>
}

// Funciones para gestionar disponibilidades
export async function crearDisponibilidad(disponibilidad: Disponibilidad) {
  const res = await fetch(`${DATE_API_URL}/api/dates/disponibilidad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disponibilidad),
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Error al crear la disponibilidad')
  }
  return res.json() as Promise<Disponibilidad>
}

export async function crearDisponibilidadesMasivas(
  idPsicologo: number,
  fechaInicio: string,
  fechaFin: string,
  horaInicio: string,
  horaFin: string
) {
  const params = new URLSearchParams({
    idPsicologo: idPsicologo.toString(),
    fechaInicio,
    fechaFin,
    horaInicio,
    horaFin,
  })
  const res = await fetch(`${DATE_API_URL}/api/dates/disponibilidades/masivas?${params}`, {
    method: 'POST',
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Error al crear las disponibilidades')
  }
  return res.text()
}

export default {
  API_URL,
  DATE_API_URL,
  registerUser,
  generateToken,
  validateToken,
  getAllUsers,
  crearCita,
  obtenerTodasLasCitas,
  obtenerCitasPorCliente,
  obtenerCitasPorPsicologo,
  crearDisponibilidad,
  crearDisponibilidadesMasivas,
}
