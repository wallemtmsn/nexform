// ============================================================
// src/pages/InspecaoCarga/components/TopbarIC.jsx
// ============================================================

import './TopbarIC.css'

export default function TopbarIC({ aba, onTrocarAba, qtdPendentes, usuario, empresa, onVoltar }) {
  return (
    <header className="ic-topbar">
      <div className="ic-topbar-left">
        <a href="#" className="ic-brand" onClick={e => { e.preventDefault(); onVoltar() }}>
          Nex<span>form</span>
        </a>
        <div className="ic-topbar-sep" />
        <div className="ic-client">
          <span className="ic-client-label">Sistema desenvolvido para</span>
          <span className="ic-client-name">
            {empresa.nomeFantasia}
            <span className="ic-client-location"> · {empresa.localidade}</span>
          </span>
        </div>
      </div>

      <div className="ic-topbar-center">
        <button
          className={`ic-tab ${aba === 'dashboard' ? 'ic-tab--active' : ''}`}
          onClick={() => onTrocarAba('dashboard')}
        >
          <i className="bi bi-grid-1x2" />
          Dashboard
          {qtdPendentes > 0 && (
            <span className="ic-tab-badge">{qtdPendentes}</span>
          )}
        </button>
        <button
          className={`ic-tab ${aba === 'form' ? 'ic-tab--active' : ''}`}
          onClick={() => onTrocarAba('form')}
        >
          <i className="bi bi-clipboard-plus" />
          Nova Inspeção
        </button>
      </div>

      <div className="ic-topbar-right">
        <div className="ic-perfil-badge" title={`Perfil: ${usuario.perfil}`}>
          <i className={`bi ${usuario.perfil === 'lider' ? 'bi-shield-check' : 'bi-person'}`} />
          <span>{usuario.perfil === 'lider' ? 'Líder' : 'Operador'}</span>
        </div>
        <div className="ic-user-pill">
          <i className="bi bi-person-circle" />
          {usuario.nome} &nbsp;·&nbsp; {usuario.cargo}
        </div>
        <button className="ic-back-btn" onClick={onVoltar} title="Voltar ao painel">
          <i className="bi bi-grid" />
        </button>
      </div>
    </header>
  )
}
