import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/shared/lib/hooks'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  const status = useAppSelector((state) => state.auth.status)

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Florgurumi</h1>
          <p className="text-sm text-muted-foreground">Ingresa con tu correo y contraseña</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
