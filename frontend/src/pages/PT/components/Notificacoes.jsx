// ============================================================
// src/pages/PT/components/Notificacoes.jsx
// Toasts de notificação de vencimento de PTs
// ============================================================

import { useEffect } from 'react'
import './Notificacoes.css'

export default function Notificacoes({ notifs, onDismiss }) {
  // Auto-dismiss após 7 segundos
  useEffect(() => {
    if (!notifs.length) return
    const timer = setTimeout(() => {
      notifs.forEach((_, i) => onDismiss(i))
    }, 7000)
    return () => clearTimeout(timer)
  }, [notifs])

  if (!notifs.length) return null

  return (
    <div className="notif-container">
      {notifs.map((n, i) => (
        <div key={i} className={`notif-toast ${n.tipo === 'danger' ? 'notif-toast--danger' : ''}`}>
          <div className="notif-icon">
            <i className={`bi ${n.tipo === 'danger' ? 'bi-exclamation-octagon' : 'bi-clock-history'}`} />
          </div>
          <div className="notif-body">
            <strong>{n.msg}</strong>
            <span>{n.sub}</span>
          </div>
          <button className="notif-close" onClick={() => onDismiss(i)}>
            <i className="bi bi-x" />
          </button>
        </div>
      ))}
    </div>
  )
}
