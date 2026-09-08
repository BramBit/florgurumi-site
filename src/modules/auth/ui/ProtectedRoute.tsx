import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/shared/lib/hooks'

export function ProtectedRoute() {
  const status = useAppSelector((state) => state.auth.status)

  if (status === 'idle' || status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
