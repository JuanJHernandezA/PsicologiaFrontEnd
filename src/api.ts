const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999'

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

export default {
  API_URL,
  registerUser,
  generateToken,
  validateToken,
  getAllUsers,
}
