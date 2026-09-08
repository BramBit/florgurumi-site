import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthListener, ProtectedRoute, LoginPage } from '@/modules/auth'
import { ProductsPage } from '@/modules/products'

function App() {
  return (
    <AuthListener>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ProductsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthListener>
  )
}

export default App
