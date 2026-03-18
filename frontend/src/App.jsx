// ============================================================
// src/App.jsx
// Roteamento principal da aplicação
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login     from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'

// Rota protegida — redireciona para login se não autenticado
function RotaProtegida({ children }) {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RotaProtegida>
            <Dashboard />
          </RotaProtegida>
        }
      />
      {/* Redireciona qualquer rota desconhecida para o login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
