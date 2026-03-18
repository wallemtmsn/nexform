// ============================================================
// src/pages/PT/components/DashboardPT.jsx
// Dashboard de PTs emitidas com filtros e status de validade
// ============================================================

import { useState, useMemo } from 'react'
import './DashboardPT.css'

function getDaysLeft(dataFim) {
  const today = new Date(); today.setHours(0,0,0,0)
  const end   = new Date(dataFim); end.setHours(0,0,0,0)
  return Math.ceil((end - today) / 86400000)
}

function resolveStatus(row) {
  if (row.status === 'encerrada') return 'encerrada'
  const d = getDaysLeft(row.dataFim)
  if (d < 0)  return 'vencida'
  if (d === 0) return 'vencendo'
  return 'ativa'
}

function fmtDate(s) {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

const STATUS_CONFIG = {
  ativa:     { label: 'Ativa',     cls: 'status-ativa' },
  vencendo:  { label: 'Vencendo',  cls: 'status-vencendo' },
  vencida:   { label: 'Vencida',   cls: 'status-vencida' },
  encerrada: { label: 'Encerrada', cls: 'status-encerrada' },
}

export default function DashboardPT({ ptStore, empresa, onEncerrar, onNovaPT }) {
  const [filtro, setFiltro]   = useState('todas')
  const [busca, setBusca]     = useState('')

  const dados = useMemo(() =>
    ptStore.map(r => ({ ...r, resolvedStatus: resolveStatus(r) })),
    [ptStore]
  )

  const stats = useMemo(() => ({
    total:    dados.length,
    ativas:   dados.filter(r => r.resolvedStatus === 'ativa').length,
    vencendo: dados.filter(r => r.resolvedStatus === 'vencendo').length,
    vencidas: dados.filter(r => r.resolvedStatus === 'vencida').length,
  }), [dados])

  const filtrados = useMemo(() => {
    let result = dados
    if (filtro !== 'todas') result = result.filter(r => r.resolvedStatus === filtro)
    if (busca) {
      const q = busca.toLowerCase()
      result = result.filter(r =>
        r.pt.toLowerCase().includes(q) ||
        r.empresa.toLowerCase().includes(q) ||
        r.responsavel.toLowerCase().includes(q) ||
        r.tipo.toLowerCase().includes(q)
      )
    }
    return result
  }, [dados, filtro, busca])

  return (
    <div className="dash-pt-wrap">

      {/* Header */}
      <div className="dash-pt-header">
        <div>
          <h1>Dashboard de PTs</h1>
          <p>{empresa.nomeFantasia} · {empresa.localidade} — Acompanhe todas as permissões emitidas.</p>
        </div>
        <button className="btn-primary-pt" onClick={onNovaPT}>
          <i className="bi bi-plus-lg" /> Nova PT
        </button>
      </div>

      {/* Stats */}
      <div className="dash-pt-stats">
        {[
          { icone: 'bi-file-earmark-text', cls: 'blue',   val: stats.total,    label: 'Total emitidas' },
          { icone: 'bi-check-circle',      cls: 'green',  val: stats.ativas,   label: 'Ativas' },
          { icone: 'bi-clock-history',     cls: 'yellow', val: stats.vencendo, label: 'Vencem em 24h' },
          { icone: 'bi-x-circle',          cls: 'red',    val: stats.vencidas, label: 'Vencidas' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon stat-icon--${s.cls}`}><i className={`bi ${s.icone}`} /></div>
            <div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros + busca */}
      <div className="dash-pt-filters">
        {['todas','ativa','vencendo','vencida','encerrada'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filtro === f ? 'filter-btn--active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="dash-search">
          <i className="bi bi-search" />
          <input placeholder="Buscar por PT, empresa..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
      </div>

      {/* Tabela */}
      <div className="pt-table">
        <div className="pt-table-head">
          <div>Nº da PT</div>
          <div>Empresa / Responsável</div>
          <div>Tipo de Serviço</div>
          <div>Local</div>
          <div>Risco</div>
          <div>Validade</div>
          <div>Status</div>
          <div></div>
        </div>
        <div className="pt-table-body">
          {filtrados.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-file-earmark-x" />
              <p>Nenhuma PT encontrada com esses filtros.</p>
            </div>
          ) : filtrados.map(r => {
            const d   = getDaysLeft(r.dataFim)
            const st  = r.resolvedStatus
            const cfg = STATUS_CONFIG[st] || STATUS_CONFIG.encerrada

            let validadeEl
            if (st === 'encerrada') {
              validadeEl = <span className="validade validade--ok">{fmtDate(r.dataFim)}</span>
            } else if (d < 0) {
              validadeEl = <span className="validade validade--expired"><i className="bi bi-exclamation-circle" /> Vencida há {Math.abs(d)}d</span>
            } else if (d === 0) {
              validadeEl = <span className="validade validade--warn"><i className="bi bi-clock" /> Vence hoje</span>
            } else {
              validadeEl = <span className={`validade ${d <= 2 ? 'validade--warn' : 'validade--ok'}`}>{fmtDate(r.dataFim)} · {d}d</span>
            }

            const riscoColor = r.risco === 'Alto' ? '#dc2626' : r.risco === 'Médio' ? '#d97706' : '#16a34a'

            return (
              <div key={r.pt} className={`pt-row pt-row--${st}`}>
                <div className="pt-cell-num">{r.pt}</div>
                <div>
                  <div className="pt-cell">{r.empresa}</div>
                  <div className="pt-cell pt-cell--muted">{r.responsavel}</div>
                </div>
                <div className="pt-cell pt-cell--muted pt-cell--sm">{r.tipo}</div>
                <div className="pt-cell pt-cell--muted">{r.local}</div>
                <div><span style={{ fontSize: '0.75rem', fontWeight: 600, color: riscoColor }}>{r.risco}</span></div>
                <div>{validadeEl}</div>
                <div><span className={`status-pill ${cfg.cls}`}>{cfg.label}</span></div>
                <div className="row-actions">
                  {st !== 'encerrada' && (
                    <button className="row-btn" title="Encerrar PT" onClick={() => { if (window.confirm(`Encerrar a PT ${r.pt}?`)) onEncerrar(r.pt) }}>
                      <i className="bi bi-x-lg" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
