// ============================================================
// src/pages/Checklist/components/FormChecklist.jsx
// Formulário de preenchimento do checklist diário
// ============================================================

import { useState } from 'react'
import { CHECKLIST_ITEMS, CATEGORIAS, TURNOS } from '../../../data/checklistItems'
import './FormChecklist.css'

function gerarNumero() {
  return `CK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

export default function FormChecklist({ usuario, empresa, onSalvar }) {
  const [ckNum]           = useState(gerarNumero)
  const [cabecalho, setCab] = useState({
    data:        new Date().toISOString().split('T')[0],
    turno:       '',
    hora:        new Date().toTimeString().slice(0, 5),
    horimetro:   '',
    equipamento: '',
  })
  const [respostas, setRespostas] = useState({}) // { itemId: 'C' | 'NC' | 'NA' }
  const [obsItens, setObsItens]   = useState({}) // { itemId: 'texto' }
  const [obsGeral, setObsGeral]   = useState('')
  const [erro, setErro]           = useState('')
  const [enviando, setEnviando]   = useState(false)

  function setCabField(key, val) {
    setCab(prev => ({ ...prev, [key]: val }))
  }

  function setResposta(id, valor) {
    setRespostas(prev => ({ ...prev, [id]: valor }))
  }

  function setObsItem(id, txt) {
    setObsItens(prev => ({ ...prev, [id]: txt }))
  }

  // ── Validação
  function validar() {
    if (!cabecalho.turno)       return 'Selecione o turno.'
    if (!cabecalho.horimetro)   return 'Informe o horímetro do equipamento.'
    if (!cabecalho.equipamento) return 'Informe o equipamento (BPT).'

    const naoRespondidos = CHECKLIST_ITEMS.filter(i => !respostas[i.id])
    if (naoRespondidos.length > 0) {
      return `${naoRespondidos.length} item(ns) sem resposta. Todos devem ser marcados como C, NC ou NA.`
    }
    return null
  }

  function handleEnviar() {
    setErro('')
    const erroMsg = validar()
    if (erroMsg) { setErro(erroMsg); window.scrollTo({ top: 0, behavior: 'smooth' }); return }

    setEnviando(true)
    setTimeout(() => {
      const conformes      = CHECKLIST_ITEMS.filter(i => respostas[i.id] === 'C').length
      const naoConformes   = CHECKLIST_ITEMS.filter(i => respostas[i.id] === 'NC').length
      const naoAplicaveis  = CHECKLIST_ITEMS.filter(i => respostas[i.id] === 'NA').length

      // Monta texto de observações dos itens NC
      const obsNCs = CHECKLIST_ITEMS
        .filter(i => respostas[i.id] === 'NC')
        .map(i => `Item ${i.id}: ${obsItens[i.id] || '(sem observação)'}`)
        .join(' | ')

      onSalvar({
        ...cabecalho,
        totalItens: CHECKLIST_ITEMS.length,
        conformes,
        naoConformes,
        naoAplicaveis,
        observacoes: [obsNCs, obsGeral].filter(Boolean).join(' — '),
        respostas,
        obsItens,
      })
      setEnviando(false)
    }, 600)
  }

  const progresso = Object.keys(respostas).length
  const total     = CHECKLIST_ITEMS.length
  const pct       = Math.round((progresso / total) * 100)

  return (
    <div className="form-ck-wrap">

      {/* Header */}
      <div className="form-ck-header">
        <div>
          <h1>Checklist Diário — Empilhadeiras</h1>
          <p>Preencha todos os itens antes de iniciar a operação.</p>
        </div>
        <div className="ck-numero">
          <span>Número</span>
          <strong>{ckNum}</strong>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="form-ck-progress">
        <div className="form-ck-progress-bar" style={{ width: `${pct}%` }} />
        <span>{progresso} / {total} itens respondidos ({pct}%)</span>
      </div>

      {/* Erro */}
      {erro && (
        <div className="form-ck-erro">
          <i className="bi bi-exclamation-circle" />
          <span>{erro}</span>
        </div>
      )}

      {/* ── CABEÇALHO ── */}
      <div className="ck-card">
        <div className="ck-card-header">
          <i className="bi bi-info-circle" /><h2>Identificação</h2>
        </div>
        <div className="ck-card-body">
          <div className="ck-grid ck-grid-3">
            <div className="ck-fgroup">
              <label>Data <span className="req">*</span></label>
              <input type="date" value={cabecalho.data} onChange={e => setCabField('data', e.target.value)} />
            </div>
            <div className="ck-fgroup">
              <label>Turno <span className="req">*</span></label>
              <select value={cabecalho.turno} onChange={e => setCabField('turno', e.target.value)}>
                <option value="">Selecione...</option>
                {TURNOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="ck-fgroup">
              <label>Hora</label>
              <input type="time" value={cabecalho.hora} onChange={e => setCabField('hora', e.target.value)} />
            </div>
            <div className="ck-fgroup">
              <label>Horímetro Equipamento <span className="req">*</span></label>
              <input type="text" placeholder="Ex: 1250" value={cabecalho.horimetro} onChange={e => setCabField('horimetro', e.target.value)} />
            </div>
            <div className="ck-fgroup">
              <label>Equipamento (BPT) <span className="req">*</span></label>
              <input type="text" placeholder="Ex: EMP-01" value={cabecalho.equipamento} onChange={e => setCabField('equipamento', e.target.value)} />
            </div>
            <div className="ck-fgroup">
              <label>Operador</label>
              <input type="text" value={usuario.nome} disabled style={{ opacity: 0.7 }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── OBSERVAÇÕES GERAIS ── */}
      <div className="ck-obs-box">
        <div className="ck-obs-titulo">OBSERVAÇÃO IMPORTANTE</div>
        <ul className="ck-obs-lista">
          <li>Qualquer marcação de um item <strong>"NC"</strong> sinalizado com <i className="bi bi-exclamation-triangle" style={{color:'#dc2626'}} /> inviabiliza a operação até avaliação do responsável da manutenção.</li>
        </ul>
      </div>

      {/* ── LEGENDA ── */}
      <div className="ck-legenda">
        <span><strong>C</strong> = Conforme</span>
        <span><strong>NC</strong> = Não Conforme</span>
        <span><strong>NA</strong> = Não Aplicável</span>
        <span className="ck-legenda-critico"><i className="bi bi-exclamation-triangle" /> Item crítico — inviabiliza operação se NC</span>
      </div>

      {/* ── ITENS DO CHECKLIST ── */}
      {CATEGORIAS.map(cat => {
        const itensCat = CHECKLIST_ITEMS.filter(i => i.categoria === cat)
        return (
          <div key={cat} className="ck-card">
            <div className="ck-card-header">
              <i className="bi bi-clipboard-check" />
              <h2>{cat}</h2>
              <span className="ck-cat-count">{itensCat.length} itens</span>
            </div>
            <div className="ck-card-body ck-card-body--itens">

              {/* Cabeçalho da tabela */}
              <div className={`ck-itens-head ${cat === 'Telemetria' ? 'ck-itens-head--na' : ''}`}>
                <div className="ck-itens-head-num">#</div>
                <div className="ck-itens-head-desc">Descrição</div>
                <div className="ck-itens-head-opt">C</div>
                <div className="ck-itens-head-opt">NC</div>
                {cat === 'Telemetria' && <div className="ck-itens-head-opt">NA</div>}
              </div>

              {itensCat.map(item => {
                const resp    = respostas[item.id]
                const isNC    = resp === 'NC'
                return (
                  <div key={item.id} className={`ck-item-row ${item.temNA ? 'ck-item-row--has-na' : ''} ${isNC ? 'ck-item-row--nc' : ''} ${item.critico ? 'ck-item-row--critico' : ''}`}>
                    <div className="ck-item-num">
                      {item.critico && <i className="bi bi-exclamation-triangle ck-critico-icon" title="Item crítico — inviabiliza operação se NC" />}
                      {item.id}
                    </div>
                    <div className="ck-item-desc">{item.texto}</div>

                    {/* C */}
                    <div className="ck-item-opt">
                      <button
                        type="button"
                        className={`ck-opt-btn ck-opt-btn--c ${resp === 'C' ? 'ck-opt-btn--selected' : ''}`}
                        onClick={() => setResposta(item.id, resp === 'C' ? undefined : 'C')}
                      >C</button>
                    </div>

                    {/* NC */}
                    <div className="ck-item-opt">
                      <button
                        type="button"
                        className={`ck-opt-btn ck-opt-btn--nc ${resp === 'NC' ? 'ck-opt-btn--selected' : ''}`}
                        onClick={() => setResposta(item.id, resp === 'NC' ? undefined : 'NC')}
                      >NC</button>
                    </div>

                    {/* NA — só para itens de telemetria */}
                    {item.temNA && (
                      <div className="ck-item-opt">
                        <button
                          type="button"
                          className={`ck-opt-btn ck-opt-btn--na ${resp === 'NA' ? 'ck-opt-btn--selected' : ''}`}
                          onClick={() => setResposta(item.id, resp === 'NA' ? undefined : 'NA')}
                        >NA</button>
                      </div>
                    )}

                    {/* Campo de observação para itens NC */}
                    {isNC && (
                      <div className="ck-item-obs">
                        <input
                          type="text"
                          placeholder="Descreva a não conformidade..."
                          value={obsItens[item.id] || ''}
                          onChange={e => setObsItem(item.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ── OBSERVAÇÕES FINAIS ── */}
      <div className="ck-card">
        <div className="ck-card-header">
          <i className="bi bi-chat-left-text" /><h2>Observações Gerais</h2>
        </div>
        <div className="ck-card-body">
          <div className="ck-fgroup">
            <label>Observações adicionais (opcional)</label>
            <textarea
              value={obsGeral}
              onChange={e => setObsGeral(e.target.value)}
              placeholder="Registre qualquer observação adicional sobre o estado do equipamento..."
              style={{ minHeight: '80px' }}
            />
          </div>
          <div className="ck-assinatura-box">
            <div className="ck-sig-field">
              <div className="ck-sig-label">Nome Operador / Matrícula</div>
              <div className="ck-sig-value">{usuario.nome}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="form-ck-actions">
        <div className="form-ck-progress-info">
          {progresso < total
            ? <span className="text-warn"><i className="bi bi-exclamation-circle" /> {total - progresso} itens sem resposta</span>
            : <span className="text-ok"><i className="bi bi-check-circle" /> Todos os itens respondidos</span>
          }
        </div>
        <button className="ck-btn-primary" onClick={handleEnviar} disabled={enviando}>
          {enviando
            ? <><i className="bi bi-hourglass-split" /> Enviando...</>
            : <><i className="bi bi-send-check" /> Enviar para Aprovação</>
          }
        </button>
      </div>

    </div>
  )
}
