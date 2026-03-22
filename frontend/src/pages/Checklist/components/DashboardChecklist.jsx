// ============================================================
// src/pages/Checklist/components/DashboardChecklist.jsx
// Dashboard de checklists com histórico e aprovação do líder
// ============================================================

import { useState, useMemo } from 'react'
import ModalAprovacao from './ModalAprovacao'
import { gerarPDFChecklist } from '../utils/gerarPDFChecklist'
import './DashboardChecklist.css'

function fmtDate(s) {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

const STATUS_CONFIG = {
  aguardando: { label: 'Aguardando',  cls: 'status-aguardando', icone: 'bi-hourglass-split' },
  aprovado:   { label: 'Aprovado',    cls: 'status-aprovado',   icone: 'bi-check-circle-fill' },
  reprovado:  { label: 'Reprovado',   cls: 'status-reprovado',  icone: 'bi-x-circle-fill' },
}

export default function DashboardChecklist({ store, usuario, empresa, onAprovar, onNovoChecklist }) {
  const [filtro, setFiltro]         = useState('todos')
  const [busca, setBusca]           = useState('')
  const [modalChecklist, setModal]  = useState(null)
  const [gerandoPDF, setGerandoPDF] = useState(null) // id do checklist sendo gerado

  const isLider = usuario.perfil === 'lider'

  const stats = useMemo(() => ({
    total:      store.length,
    aguardando: store.filter(c => c.status === 'aguardando').length,
    aprovado:   store.filter(c => c.status === 'aprovado').length,
    comNC:      store.filter(c => c.naoConformes > 0).length,
  }), [store])

  const filtrados = useMemo(() => {
    let result = store
    if (filtro !== 'todos') result = result.filter(c => c.status === filtro)
    if (busca) {
      const q = busca.toLowerCase()
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.operador.toLowerCase().includes(q) ||
        c.equipamento.toLowerCase().includes(q)
      )
    }
    return result
  }, [store, filtro, busca])

  function handleAprovar(checklist) {
    setModal(checklist)
  }

  function confirmarAprovacao() {
    onAprovar(modalChecklist.id)
    setModal(null)
  }

  async function handleGerarPDF(checklist) {
    setGerandoPDF(checklist.id)
    try {
      await gerarPDFChecklist(checklist, empresa)
    } catch (e) {
      alert('Erro ao gerar PDF. Tente novamente.')
    }
    setGerandoPDF(null)
  }

  return (
    <div className="ck-dash-wrap">

      {/* Header */}
      <div className="ck-dash-header">
        <div>
          <h1>Dashboard de Checklists</h1>
          <p>{empresa.nomeFantasia} · {empresa.localidade} — Histórico de inspeções diárias.</p>
        </div>
        <button className="ck-btn-primary" onClick={onNovoChecklist}>
          <i className="bi bi-clipboard-plus" /> Novo Checklist
        </button>
      </div>

      {/* Stats */}
      <div className="ck-stats">
        {[
          { icone: 'bi-clipboard-data',  cls: 'blue',   val: stats.total,      label: 'Total realizados' },
          { icone: 'bi-hourglass-split', cls: 'yellow', val: stats.aguardando, label: 'Aguardando aprovação' },
          { icone: 'bi-check-circle',    cls: 'green',  val: stats.aprovado,   label: 'Aprovados' },
          { icone: 'bi-exclamation-triangle', cls: 'red', val: stats.comNC,   label: 'Com itens NC' },
        ].map(s => (
          <div key={s.label} className="ck-stat-card">
            <div className={`ck-stat-icon ck-stat-icon--${s.cls}`}>
              <i className={`bi ${s.icone}`} />
            </div>
            <div>
              <div className="ck-stat-val">{s.val}</div>
              <div className="ck-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros + busca */}
      <div className="ck-filters">
        {['todos', 'aguardando', 'aprovado'].map(f => (
          <button
            key={f}
            className={`ck-filter-btn ${filtro === f ? 'ck-filter-btn--active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="ck-search">
          <i className="bi bi-search" />
          <input
            placeholder="Buscar por ID, operador, equipamento..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Aviso para líder se houver pendentes */}
      {isLider && stats.aguardando > 0 && (
        <div className="ck-lider-alert">
          <i className="bi bi-bell-fill" />
          <span>
            <strong>{stats.aguardando} checklist{stats.aguardando > 1 ? 's' : ''} aguardando sua aprovação.</strong>
            {' '}Clique em "Aprovar" para validar e assinar digitalmente.
          </span>
        </div>
      )}

      {/* Tabela */}
      <div className="ck-table">
        <div className="ck-table-head">
          <div>ID</div>
          <div>Data / Turno</div>
          <div>Operador</div>
          <div>Equipamento</div>
          <div>Itens</div>
          <div>NC</div>
          <div>Status</div>
          <div>Líder</div>
          <div></div>
        </div>

        <div className="ck-table-body">
          {filtrados.length === 0 ? (
            <div className="ck-empty">
              <i className="bi bi-clipboard-x" />
              <p>Nenhum checklist encontrado.</p>
            </div>
          ) : filtrados.map(c => {
            const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.aguardando
            return (
              <div key={c.id} className={`ck-row ${c.naoConformes > 0 ? 'ck-row--nc' : ''}`}>
                <div className="ck-cell-id">{c.id}</div>
                <div>
                  <div className="ck-cell">{fmtDate(c.data)}</div>
                  <div className="ck-cell ck-cell--muted">{c.turno}</div>
                </div>
                <div className="ck-cell">{c.operador}</div>
                <div className="ck-cell ck-cell--muted">{c.equipamento}</div>
                <div>
                  <span className="ck-itens-pill">
                    {c.conformes}C / {c.naoAplicaveis}NA
                  </span>
                </div>
                <div>
                  {c.naoConformes > 0
                    ? <span className="ck-nc-badge"><i className="bi bi-exclamation-circle" /> {c.naoConformes} NC</span>
                    : <span className="ck-ok-badge"><i className="bi bi-check" /> 0 NC</span>
                  }
                </div>
                <div>
                  <span className={`ck-status-pill ${cfg.cls}`}>
                    <i className={`bi ${cfg.icone}`} /> {cfg.label}
                  </span>
                </div>
                <div className="ck-cell ck-cell--muted" style={{ fontSize: '0.75rem' }}>
                  {c.lider || '—'}
                </div>
                <div className="ck-row-actions">
                  <button
                    className="ck-pdf-btn"
                    title="Baixar PDF"
                    onClick={() => handleGerarPDF(c)}
                    disabled={gerandoPDF === c.id}
                  >
                    {gerandoPDF === c.id
                      ? <i className="bi bi-hourglass-split" />
                      : <i className="bi bi-file-earmark-pdf" />
                    }
                  </button>
                  {isLider && c.status === 'aguardando' && (
                    <button className="ck-aprovar-btn" onClick={() => handleAprovar(c)}>
                      <i className="bi bi-shield-check" /> Aprovar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal de aprovação */}
      {modalChecklist && (
        <ModalAprovacao
          checklist={modalChecklist}
          usuario={usuario}
          onConfirmar={confirmarAprovacao}
          onCancelar={() => setModal(null)}
        />
      )}

    </div>
  )
}
