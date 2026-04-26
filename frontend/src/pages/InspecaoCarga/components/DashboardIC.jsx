// ============================================================
// src/pages/InspecaoCarga/components/DashboardIC.jsx
// ============================================================

import { useState, useMemo } from 'react'
import './DashboardIC.css'

const FILTROS = ['todos', 'aguardando', 'aprovado', 'reprovado']

const FILTRO_LABELS = {
  todos:      'Todos',
  aguardando: 'Aguardando',
  aprovado:   'Aprovado',
  reprovado:  'Reprovado',
}

export default function DashboardIC({ store, usuario, onAprovar, onReprovar, onNovaInspecao }) {
  const [filtro, setFiltro] = useState('todos')
  const [buscando, setBuscando] = useState('')

  const lista = useMemo(() => {
    let itens = filtro === 'todos' ? store : store.filter(i => i.status === filtro)
    if (buscando.trim()) {
      const q = buscando.toLowerCase()
      itens = itens.filter(i =>
        i.id.toLowerCase().includes(q) ||
        i.cliente.toLowerCase().includes(q) ||
        i.inspecionadoPor?.toLowerCase().includes(q)
      )
    }
    return itens
  }, [store, filtro, buscando])

  const stats = useMemo(() => ({
    total:      store.length,
    aguardando: store.filter(i => i.status === 'aguardando').length,
    aprovado:   store.filter(i => i.status === 'aprovado').length,
    reprovado:  store.filter(i => i.status === 'reprovado').length,
  }), [store])

  function formatDate(d) {
    if (!d) return '—'
    const [y, m, dia] = d.split('-')
    return `${dia}/${m}/${y}`
  }

  function resultadoClass(reg) {
    if (reg.naoConformes === 0) return 'ic-dash-result--ok'
    if (reg.naoConformes <= 2) return 'ic-dash-result--warn'
    return 'ic-dash-result--danger'
  }

  return (
    <div className="ic-dash-wrap">

      {/* Stats */}
      <div className="ic-stats-grid">
        <div className="ic-stat-card">
          <span className="ic-stat-label">Total</span>
          <strong className="ic-stat-value">{stats.total}</strong>
        </div>
        <div className="ic-stat-card ic-stat-card--warn">
          <span className="ic-stat-label">Aguardando</span>
          <strong className="ic-stat-value">{stats.aguardando}</strong>
        </div>
        <div className="ic-stat-card ic-stat-card--ok">
          <span className="ic-stat-label">Aprovados</span>
          <strong className="ic-stat-value">{stats.aprovado}</strong>
        </div>
        <div className="ic-stat-card ic-stat-card--danger">
          <span className="ic-stat-label">Reprovados</span>
          <strong className="ic-stat-value">{stats.reprovado}</strong>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="ic-dash-controls">
        <div className="ic-filtros">
          {FILTROS.map(f => (
            <button
              key={f}
              className={`ic-filtro-btn ${filtro === f ? 'ic-filtro-btn--active' : ''}`}
              onClick={() => setFiltro(f)}
            >
              {FILTRO_LABELS[f]}
              {f !== 'todos' && (
                <span className="ic-filtro-count">{stats[f]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="ic-dash-right">
          <div className="ic-busca">
            <i className="bi bi-search" />
            <input
              type="text"
              placeholder="Buscar por número, cliente ou inspetor..."
              value={buscando}
              onChange={e => setBuscando(e.target.value)}
            />
          </div>
          <button className="ic-btn-nova" onClick={onNovaInspecao}>
            <i className="bi bi-clipboard-plus" /> Nova Inspeção
          </button>
        </div>
      </div>

      {/* Lista */}
      {lista.length === 0 ? (
        <div className="ic-dash-empty">
          <i className="bi bi-clipboard-x" />
          <p>Nenhuma inspeção encontrada.</p>
          <button className="ic-btn-nova" onClick={onNovaInspecao}>
            <i className="bi bi-clipboard-plus" /> Criar primeira inspeção
          </button>
        </div>
      ) : (
        <div className="ic-registros">
          {lista.map(reg => (
            <div key={reg.id} className="ic-reg-card">
              <div className="ic-reg-top">
                <div className="ic-reg-id">
                  <span className="ic-reg-num">{reg.id}</span>
                  <span className={`ic-reg-tipo-badge ${reg.tipo === 'maritimo' ? 'ic-reg-tipo-badge--mar' : ''}`}>
                    <i className={`bi ${reg.tipo === 'maritimo' ? 'bi-water' : 'bi-truck'}`} />
                    {reg.tipo === 'maritimo' ? 'Marítimo' : 'Terrestre'}
                  </span>
                </div>
                <span className={`ic-status-badge ic-status-badge--${reg.status}`}>
                  {reg.status === 'aguardando' && <><i className="bi bi-hourglass-split" /> Aguardando</>}
                  {reg.status === 'aprovado'   && <><i className="bi bi-check-circle" /> Aprovado</>}
                  {reg.status === 'reprovado'  && <><i className="bi bi-x-circle" /> Reprovado</>}
                </span>
              </div>

              <div className="ic-reg-body">
                <div className="ic-reg-info">
                  <div className="ic-reg-field">
                    <span>Cliente</span>
                    <strong>{reg.cliente}</strong>
                  </div>
                  {reg.tipo === 'terrestre' ? (
                    <>
                      <div className="ic-reg-field">
                        <span>Motorista</span>
                        <strong>{reg.motorista || '—'}</strong>
                      </div>
                      <div className="ic-reg-field">
                        <span>Placa</span>
                        <strong>{reg.placa || '—'}</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ic-reg-field">
                        <span>Embarcação</span>
                        <strong>{reg.embarcacao || '—'}</strong>
                      </div>
                      <div className="ic-reg-field">
                        <span>Manifesto</span>
                        <strong>{reg.manifesto || '—'}</strong>
                      </div>
                    </>
                  )}
                  <div className="ic-reg-field">
                    <span>Inspetor</span>
                    <strong>{reg.inspecionadoPor}</strong>
                  </div>
                  <div className="ic-reg-field">
                    <span>Data / Hora</span>
                    <strong>{formatDate(reg.data)} {reg.hora && `· ${reg.hora}`}</strong>
                  </div>
                </div>

                <div className="ic-reg-resultado">
                  <div className={`ic-dash-result ${resultadoClass(reg)}`}>
                    <div className="ic-result-item">
                      <span>{reg.conformes}</span>
                      <label>Conformes</label>
                    </div>
                    <div className="ic-result-item">
                      <span>{reg.naoConformes}</span>
                      <label>NC</label>
                    </div>
                    <div className="ic-result-item">
                      <span>{reg.naoAplicaveis}</span>
                      <label>NA</label>
                    </div>
                    <div className="ic-result-item">
                      <span>{reg.totalItens}</span>
                      <label>Total</label>
                    </div>
                  </div>

                  {reg.observacoes && (
                    <div className="ic-reg-obs">
                      <i className="bi bi-chat-left-text" />
                      <span>{reg.observacoes}</span>
                    </div>
                  )}

                  {reg.status === 'aprovado' && reg.finalizadoPor && (
                    <div className="ic-reg-finalizador">
                      <i className="bi bi-patch-check-fill" />
                      <span>Finalizado por <strong>{reg.finalizadoPor}</strong> em {formatDate(reg.dataAprovacao)}</span>
                    </div>
                  )}

                  {/* Botões de ação para o líder */}
                  {usuario.perfil === 'lider' && reg.status === 'aguardando' && (
                    <div className="ic-reg-acoes">
                      <button
                        className="ic-btn-aprovar"
                        onClick={() => onAprovar(reg.id)}
                      >
                        <i className="bi bi-check-lg" /> Aprovar
                      </button>
                      <button
                        className="ic-btn-reprovar"
                        onClick={() => onReprovar(reg.id)}
                      >
                        <i className="bi bi-x-lg" /> Reprovar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
