import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthListener, ProtectedRoute, LoginPage } from '@/modules/auth'

function App() {
  return (
    <AuthListener>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div className="p-8">Florgurumi — en construcción</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthListener>
  )
}

export default App
