import { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../context/ApiContext'
import {
  listarNotificacionesPorCliente,
  listarNotificacionesPorPsicologo,
  eliminarNotificacion,
  type NotificationItem,
} from '../api'

export default function Notificaciones() {
  const { role, user } = useAuth()
  const { addNotification, startLoading, stopLoading } = useApi()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    if (!user?.id || !role) return
    try {
      setLoading(true)
      startLoading()
      let data: NotificationItem[] = []
      if (role === 'Estudiante') {
        data = await listarNotificacionesPorCliente(user.id)
      } else if (role === 'Psicologo') {
        data = await listarNotificacionesPorPsicologo(user.id)
      } else {
        addNotification('info', 'Los administradores no tienen bandeja de notificaciones')
      }
      setItems(data)
      addNotification('success', 'Notificaciones actualizadas')
      window.dispatchEvent(new Event('notifications:updated'))
    } catch (err: any) {
      addNotification('error', err.message || 'Error cargando notificaciones')
    } finally {
      setLoading(false)
      stopLoading()
    }
  }, [user?.id, role, startLoading, stopLoading, addNotification])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleEliminar = async (id: number) => {
    try {
      await eliminarNotificacion(id)
      setItems(prev => prev.filter(n => n.id !== id))
      addNotification('success', 'Notificación eliminada')
      window.dispatchEvent(new Event('notifications:updated'))
    } catch (err: any) {
      addNotification('error', err.message || 'No se pudo eliminar')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Notificaciones</h1>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-600">No hay notificaciones disponibles.</p>
        ) : (
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item.id} className="p-4 border rounded-lg flex items-start justify-between">
                <div>
                  <p className="font-medium">{item.message}</p>
                  <p className="text-sm text-gray-500">
                    Fecha: {item.fecha} · {role === 'Estudiante' ? `Psicólogo ID: ${item.idPsicologo}` : `Cliente ID: ${item.idCliente}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEliminar(item.id!)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}