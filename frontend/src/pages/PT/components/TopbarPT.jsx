// ============================================================
// src/pages/PT/components/TopbarPT.jsx
// Barra superior do sistema de PT com navegação entre abas
// ============================================================

import './TopbarPT.css'

export default function TopbarPT({ aba, onTrocarAba, qtdAlertas, usuario, empresa, onVoltar }) {
  return (
    <header className="pt-topbar">
      <div className="pt-topbar-left">
        <a href="#" className="pt-brand" onClick={e => { e.preventDefault(); onVoltar() }}>
          Nex<span>form</span>
        </a>
        <div className="pt-topbar-sep" />
        <div className="pt-client">
          <span className="pt-client-label">Sistema desenvolvido para</span>
          <span className="pt-client-name">
            {empresa.nomeFantasia}
            <span className="pt-client-location"> · {empresa.localidade}</span>
          </span>
        </div>
      </div>

      <div className="pt-topbar-center">
        <button
          className={`pt-tab ${aba === 'dashboard' ? 'pt-tab--active' : ''}`}
          onClick={() => onTrocarAba('dashboard')}
        >
          <i className="bi bi-grid-1x2" />
          Dashboard
          {qtdAlertas > 0 && (
            <span className="pt-tab-badge">{qtdAlertas}</span>
          )}
        </button>
        <button
          className={`pt-tab ${aba === 'form' ? 'pt-tab--active' : ''}`}
          onClick={() => onTrocarAba('form')}
        >
          <i className="bi bi-file-earmark-plus" />
          Nova PT
        </button>
      </div>

      <div className="pt-topbar-right">
        <div className="pt-user-pill">
          <i className="bi bi-person-circle" />
          {usuario.nome} &nbsp;·&nbsp; {usuario.cargo}
        </div>
        <button className="pt-back-btn" onClick={onVoltar} title="Voltar ao painel">
          <i className="bi bi-grid" />
        </button>
      </div>
    </header>
  )
}
