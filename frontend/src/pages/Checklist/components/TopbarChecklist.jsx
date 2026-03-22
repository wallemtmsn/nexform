// ============================================================
// src/pages/Checklist/components/TopbarChecklist.jsx
// ============================================================

import './TopbarChecklist.css'

export default function TopbarChecklist({ aba, onTrocarAba, qtdPendentes, usuario, empresa, onVoltar }) {
  return (
    <header className="ck-topbar">
      <div className="ck-topbar-left">
        <a href="#" className="ck-brand" onClick={e => { e.preventDefault(); onVoltar() }}>
          Nex<span>form</span>
        </a>
        <div className="ck-topbar-sep" />
        <div className="ck-client">
          <span className="ck-client-label">Sistema desenvolvido para</span>
          <span className="ck-client-name">
            {empresa.nomeFantasia}
            <span className="ck-client-location"> · {empresa.localidade}</span>
          </span>
        </div>
      </div>

      <div className="ck-topbar-center">
        <button
          className={`ck-tab ${aba === 'dashboard' ? 'ck-tab--active' : ''}`}
          onClick={() => onTrocarAba('dashboard')}
        >
          <i className="bi bi-grid-1x2" />
          Dashboard
          {qtdPendentes > 0 && (
            <span className="ck-tab-badge">{qtdPendentes}</span>
          )}
        </button>
        <button
          className={`ck-tab ${aba === 'form' ? 'ck-tab--active' : ''}`}
          onClick={() => onTrocarAba('form')}
        >
          <i className="bi bi-clipboard-plus" />
          Novo Checklist
        </button>
      </div>

      <div className="ck-topbar-right">
        <div className="ck-perfil-badge" title={`Perfil: ${usuario.perfil}`}>
          <i className={`bi ${usuario.perfil === 'lider' ? 'bi-shield-check' : 'bi-person'}`} />
          <span>{usuario.perfil === 'lider' ? 'Líder' : 'Operador'}</span>
        </div>
        <div className="ck-user-pill">
          <i className="bi bi-person-circle" />
          {usuario.nome} &nbsp;·&nbsp; {usuario.cargo}
        </div>
        <button className="ck-back-btn" onClick={onVoltar} title="Voltar ao painel">
          <i className="bi bi-grid" />
        </button>
      </div>
    </header>
  )
}
