import { NavLink } from 'react-router-dom'
import { Home, Package, Users, ShoppingCart, Wallet } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/productos', label: 'Productos', icon: Package, end: false },
  { to: '/clientes', label: 'Clientes', icon: Users, end: false },
  { to: '/ventas', label: 'Ventas', icon: ShoppingCart, end: false },
  { to: '/gastos', label: 'Gastos', icon: Wallet, end: false },
]

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r bg-muted/30 p-4 md:block">
      <div className="mb-6 px-2 text-lg font-semibold">Florgurumi</div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
