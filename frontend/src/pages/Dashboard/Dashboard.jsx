// ============================================================
// src/pages/Dashboard/Dashboard.jsx
// Painel de ferramentas contratadas pela empresa
// ============================================================

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Dashboard.css'

// Mapa de ícones por status da ferramenta
const STATUS_CONFIG = {
  ativa:      { label: 'Ativa',          className: 'status-ativa',      icone: 'bi-check-circle-fill' },
  manutencao: { label: 'Em manutenção',  className: 'status-manutencao', icone: 'bi-tools' },
  inativa:    { label: 'Inativa',        className: 'status-inativa',    icone: 'bi-x-circle' },
}

export default function Dashboard() {
  const navigate          = useNavigate()
  const { usuario, empresa, logout } = useAuth()

  // Redireciona para o login se não houver sessão
  if (!usuario || !empresa) {
    navigate('/')
    return null
  }

  function handleAcessarFerramenta(ferramenta) {
    if (ferramenta.status !== 'ativa') return
    navigate(ferramenta.rota)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  const agora = new Date()
  const saudacao = agora.getHours() < 12
    ? 'Bom dia' : agora.getHours() < 18
    ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="dashboard-screen">

      {/* ── TOPBAR ── */}
      <header className="dash-topbar">
        <div className="dash-topbar-left">
          <span className="dash-brand">Nex<span>form</span></span>
          <div className="dash-separator" />
          <div className="dash-client">
            <span className="dash-client-label">Área exclusiva</span>
            <span className="dash-client-name">
              {empresa.nomeFantasia}
              <span className="dash-client-location"> · {empresa.localidade}</span>
            </span>
          </div>
        </div>

        <div className="dash-topbar-right">
          <div className="dash-user-pill">
            <i className="bi bi-person-circle" />
            <span>{usuario.nome}</span>
            <span className="dash-user-cargo">· {usuario.cargo}</span>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right" />
            Sair
          </button>
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main className="dash-main">

        {/* Cabeçalho da página */}
        <div className="dash-page-header">
          <div>
            <p className="dash-eyebrow">painel de controle</p>
            <h1 className="dash-title">
              {saudacao}, {usuario.nome.split(' ')[0]}
            </h1>
            <p className="dash-subtitle">
              Selecione uma ferramenta abaixo para começar.
            </p>
          </div>
          <div className="dash-meta">
            <span className="dash-date">
              <i className="bi bi-calendar3" />
              {agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Divisor */}
        <div className="dash-divider" />

        {/* Grade de ferramentas */}
        <p className="dash-section-label">
          <i className="bi bi-grid-1x2" />
          Ferramentas contratadas ({empresa.ferramentas.length})
        </p>

        <div className="dash-tools-grid">
          {empresa.ferramentas.map(ferramenta => {
            const statusCfg  = STATUS_CONFIG[ferramenta.status] || STATUS_CONFIG.inativa
            const disponivel = ferramenta.status === 'ativa'

            return (
              <div
                key={ferramenta.id}
                className={`dash-tool-card ${!disponivel ? 'dash-tool-card--disabled' : ''}`}
                onClick={() => handleAcessarFerramenta(ferramenta)}
              >
                {/* Linha superior do card */}
                <div className="dash-tool-card-top">
                  <div className="dash-tool-icon">
                    <i className={`bi ${ferramenta.icone}`} />
                  </div>
                  <span className={`dash-tool-status ${statusCfg.className}`}>
                    <i className={`bi ${statusCfg.icone}`} />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="dash-tool-card-body">
                  <h3>{ferramenta.nome}</h3>
                  <p>{ferramenta.descricao}</p>
                </div>

                {/* Rodapé do card */}
                <div className="dash-tool-card-footer">
                  {disponivel
                    ? (
                      <span className="dash-tool-cta">
                        Acessar <i className="bi bi-arrow-right" />
                      </span>
                    ) : (
                      <span className="dash-tool-cta dash-tool-cta--disabled">
                        Indisponível no momento
                      </span>
                    )
                  }
                </div>
              </div>
            )
          })}

          {/* Card placeholder — novas ferramentas em breve */}
          <div className="dash-tool-card dash-tool-card--soon">
            <div className="dash-tool-card-top">
              <div className="dash-tool-icon dash-tool-icon--soon">
                <i className="bi bi-plus-lg" />
              </div>
            </div>
            <div className="dash-tool-card-body">
              <h3>Em breve</h3>
              <p>Novas ferramentas serão disponibilizadas conforme seu plano evolui.</p>
            </div>
            <div className="dash-tool-card-footer">
              <span className="dash-tool-cta dash-tool-cta--disabled">
                <i className="bi bi-clock" /> Em desenvolvimento
              </span>
            </div>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="dash-footer">
        <span>© 2026 Nexform · CNPJ 52.715.328/0001-28 · Plataforma de Transformação Digital</span>
        <span>Desenvolvido para {empresa.nomeFantasia} — {empresa.localidade}</span>
      </footer>

    </div>
  )
}
