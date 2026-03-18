// ============================================================
// src/contexts/AuthContext.jsx
// Contexto global de autenticação.
// Guarda o usuário logado e a empresa ativa em toda a aplicação.
// ============================================================

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)   // usuário logado
  const [empresa, setEmpresa] = useState(null)   // empresa ativa

  // Chamado após login bem-sucedido
  function login(dadosUsuario, dadosEmpresa) {
    setUsuario(dadosUsuario)
    setEmpresa(dadosEmpresa)
  }

  // Chamado ao fazer logout
  function logout() {
    setUsuario(null)
    setEmpresa(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, empresa, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto facilmente em qualquer componente
export function useAuth() {
  return useContext(AuthContext)
}
