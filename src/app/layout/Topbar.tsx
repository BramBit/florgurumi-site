import { Moon, Sun, LogOut } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks'
import { toggleTheme } from '@/shared/state/uiSlice'
import { useLogoutMutation } from '@/modules/auth'
import { Button } from '@/shared/ui/button'

export function Topbar() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)
  const staff = useAppSelector((state) => state.auth.staff)
  const email = useAppSelector((state) => state.auth.email)
  const [logout] = useLogoutMutation()

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="text-sm text-muted-foreground">
        {staff?.name ?? email}
        {staff?.isSuperAdmin && (
          <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">Súper admin</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => dispatch(toggleTheme())}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  )
}
