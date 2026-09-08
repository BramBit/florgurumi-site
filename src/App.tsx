import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthListener, ProtectedRoute, LoginPage } from '@/modules/auth'
import { ProductsPage } from '@/modules/products'
import { AppLayout } from '@/app/layout/AppLayout'

function App() {
  return (
    <AuthListener>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-semibold">Dashboard</h1>
                  <p className="text-muted-foreground">Próximamente: resumen de ventas y métricas.</p>
                </div>
              }
            />
            <Route path="/productos" element={<ProductsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthListener>
  )
}

export default App
