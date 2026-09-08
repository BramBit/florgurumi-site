import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useLoginMutation } from '../api/authApi'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [login, { isLoading }] = useLoginMutation()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await login(values).unwrap()
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'error' in err
          ? String((err as { error: unknown }).error)
          : 'No se pudo iniciar sesión'
      setServerError(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  )
}
