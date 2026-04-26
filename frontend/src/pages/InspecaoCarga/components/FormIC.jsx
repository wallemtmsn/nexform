// ============================================================
// src/pages/InspecaoCarga/components/FormIC.jsx
// Formulário de Inspeção de Carga — NEXFORMS
// ============================================================

import { useState } from 'react'
import { IC_SECOES, IC_TODOS_ITENS } from '../../../data/inspecaoCargaItems'
import './FormIC.css'

function gerarNumero() {
  return `IC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

export default function FormIC({ usuario, empresa, onSalvar }) {
  const [icNum]   = useState(gerarNumero)
  const [tipo, setTipo] = useState('terrestre') // 'terrestre' | 'maritimo'

  const [cabecalho, setCab] = useState({
    cliente:        '',
    data:           new Date().toISOString().split('T')[0],
    hora:           new Date().toTimeString().slice(0, 5),
    // Terrestre
    motorista:      '',
    romaneio:       '',
    transportadora: '',
    placa:          '',
    // Marítimo
    embarcacao:     '',
    manifesto:      '',
  })

  const [respostas, setRespostas] = useState({}) // { '1.1': 'C' | 'NC' | 'NA' }
  const [obsItens, setObsItens]   = useState({}) // { '1.1': 'texto' }
  const [obsGeral, setObsGeral]   = useState('')
  const [erro, setErro]           = useState('')
  const [enviando, setEnviando]   = useState(false)

  function setCabField(key, val) {
    setCab(prev => ({ ...prev, [key]: val }))
  }

  function setResposta(id, valor) {
    setRespostas(prev => ({ ...prev, [id]: valor === prev[id] ? undefined : valor }))
  }

  function setObsItem(id, txt) {
    setObsItens(prev => ({ ...prev, [id]: txt }))
  }

  function validar() {
    if (!cabecalho.cliente) return 'Informe o nome do cliente.'

    if (tipo === 'terrestre') {
      if (!cabecalho.motorista)      return 'Informe o nome do motorista.'
      if (!cabecalho.transportadora) return 'Informe a transportadora.'
      if (!cabecalho.placa)          return 'Informe a placa do veículo.'
    } else {
      if (!cabecalho.embarcacao) return 'Informe a embarcação.'
      if (!cabecalho.manifesto)  return 'Informe o Manifesto/MSL.'
    }

    const naoRespondidos = IC_TODOS_ITENS.filter(i => !respostas[i.id])
    if (naoRespondidos.length > 0) {
      return `${naoRespondidos.length} item(ns) sem resposta. Todos devem ser marcados como C, NC ou NA.`
    }
    return null
  }

  function handleEnviar() {
    setErro('')
    const erroMsg = validar()
    if (erroMsg) {
      setErro(erroMsg)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setEnviando(true)
    setTimeout(() => {
      const conformes     = IC_TODOS_ITENS.filter(i => respostas[i.id] === 'C').length
      const naoConformes  = IC_TODOS_ITENS.filter(i => respostas[i.id] === 'NC').length
      const naoAplicaveis = IC_TODOS_ITENS.filter(i => respostas[i.id] === 'NA').length

      const obsNCs = IC_TODOS_ITENS
        .filter(i => respostas[i.id] === 'NC')
        .map(i => `Item ${i.id}: ${obsItens[i.id] || '(sem observação)'}`)
        .join(' | ')

      onSalvar({
        ...cabecalho,
        tipo,
        totalItens: IC_TODOS_ITENS.length,
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

  const progresso = Object.keys(respostas).filter(k => respostas[k]).length
  const total     = IC_TODOS_ITENS.length
  const pct       = Math.round((progresso / total) * 100)

  return (
    <div className="ic-form-wrap">

      {/* Cabeçalho do formulário */}
      <div className="ic-form-header">
        <div>
          <div className="ic-form-title-row">
            <div className="ic-form-logo">
              Nex<span>form</span>
            </div>
            <div>
              <h1>Checklist de Inspeção de Carga</h1>
              <p>Preencha todos os campos e itens antes de finalizar a inspeção.</p>
            </div>
          </div>
        </div>
        <div className="ic-numero">
          <span>Número</span>
          <strong>{icNum}</strong>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="ic-progress-wrap">
        <div className="ic-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <span className="ic-progress-label">{progresso} / {total} itens respondidos ({pct}%)</span>

      {/* Erro de validação */}
      {erro && (
        <div className="ic-erro">
          <i className="bi bi-exclamation-circle" />
          <span>{erro}</span>
        </div>
      )}

      {/* ── IDENTIFICAÇÃO ── */}
      <div className="ic-card">
        <div className="ic-card-header">
          <i className="bi bi-info-circle" />
          <h2>Identificação</h2>
        </div>
        <div className="ic-card-body">

          {/* Tipo de operação */}
          <div className="ic-tipo-toggle">
            <button
              type="button"
              className={`ic-tipo-btn ${tipo === 'terrestre' ? 'ic-tipo-btn--active' : ''}`}
              onClick={() => setTipo('terrestre')}
            >
              <i className="bi bi-truck" /> Terrestre
            </button>
            <button
              type="button"
              className={`ic-tipo-btn ${tipo === 'maritimo' ? 'ic-tipo-btn--active' : ''}`}
              onClick={() => setTipo('maritimo')}
            >
              <i className="bi bi-water" /> Marítimo
            </button>
          </div>

          {/* Campo cliente + data/hora */}
          <div className="ic-grid ic-grid-3" style={{ marginTop: '1rem' }}>
            <div className="ic-fgroup ic-fgroup--span2">
              <label>Cliente <span className="req">*</span></label>
              <input
                type="text"
                placeholder="Nome do cliente"
                value={cabecalho.cliente}
                onChange={e => setCabField('cliente', e.target.value)}
              />
            </div>
            <div className="ic-fgroup">
              <label>Data <span className="req">*</span></label>
              <input type="date" value={cabecalho.data} onChange={e => setCabField('data', e.target.value)} />
            </div>
          </div>

          {/* Campos condicionais por tipo */}
          {tipo === 'terrestre' ? (
            <div className="ic-grid ic-grid-3" style={{ marginTop: '1rem' }}>
              <div className="ic-fgroup">
                <label>Motorista <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Nome do motorista"
                  value={cabecalho.motorista}
                  onChange={e => setCabField('motorista', e.target.value)}
                />
              </div>
              <div className="ic-fgroup">
                <label>Romaneio / Agendamento</label>
                <input
                  type="text"
                  placeholder="Nº romaneio"
                  value={cabecalho.romaneio}
                  onChange={e => setCabField('romaneio', e.target.value)}
                />
              </div>
              <div className="ic-fgroup">
                <label>Transportadora <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Nome da transportadora"
                  value={cabecalho.transportadora}
                  onChange={e => setCabField('transportadora', e.target.value)}
                />
              </div>
              <div className="ic-fgroup">
                <label>Placa <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: ABC-1234"
                  value={cabecalho.placa}
                  onChange={e => setCabField('placa', e.target.value.toUpperCase())}
                  maxLength={8}
                />
              </div>
              <div className="ic-fgroup">
                <label>Hora</label>
                <input type="time" value={cabecalho.hora} onChange={e => setCabField('hora', e.target.value)} />
              </div>
              <div className="ic-fgroup">
                <label>Inspecionado por</label>
                <input type="text" value={usuario.nome} disabled style={{ opacity: 0.65 }} />
              </div>
            </div>
          ) : (
            <div className="ic-grid ic-grid-3" style={{ marginTop: '1rem' }}>
              <div className="ic-fgroup ic-fgroup--span2">
                <label>Embarcação <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Nome ou identificação da embarcação"
                  value={cabecalho.embarcacao}
                  onChange={e => setCabField('embarcacao', e.target.value)}
                />
              </div>
              <div className="ic-fgroup">
                <label>Hora</label>
                <input type="time" value={cabecalho.hora} onChange={e => setCabField('hora', e.target.value)} />
              </div>
              <div className="ic-fgroup ic-fgroup--span2">
                <label>Manifesto / MSL <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Número do manifesto ou MSL"
                  value={cabecalho.manifesto}
                  onChange={e => setCabField('manifesto', e.target.value)}
                />
              </div>
              <div className="ic-fgroup">
                <label>Inspecionado por</label>
                <input type="text" value={usuario.nome} disabled style={{ opacity: 0.65 }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="ic-legenda">
        <span><strong>C</strong> = Conforme</span>
        <span><strong>NC</strong> = Não Conforme</span>
        <span><strong>NA</strong> = Não Aplicável</span>
      </div>

      {/* ── SEÇÕES DO CHECKLIST ── */}
      {IC_SECOES.map(secao => (
        <div key={secao.id} className="ic-card">
          <div className="ic-card-header">
            <i className={`bi ${secao.icone}`} />
            <div>
              <h2>{secao.id}. {secao.titulo}</h2>
              {secao.subtitulo && <span className="ic-secao-sub">({secao.subtitulo})</span>}
            </div>
            <span className="ic-cat-count">{secao.itens.length} itens</span>
          </div>
          <div className="ic-card-body ic-card-body--itens">

            {/* Cabeçalho da tabela */}
            <div className="ic-itens-head">
              <div className="ic-itens-head-num">#</div>
              <div className="ic-itens-head-desc">Descrição</div>
              <div className="ic-itens-head-opt">C</div>
              <div className="ic-itens-head-opt">NC</div>
              <div className="ic-itens-head-opt">NA</div>
            </div>

            {secao.itens.map(item => {
              const resp = respostas[item.id]
              const isNC = resp === 'NC'
              return (
                <div
                  key={item.id}
                  className={`ic-item-row ${isNC ? 'ic-item-row--nc' : ''}`}
                >
                  <div className="ic-item-num">{item.id}</div>
                  <div className="ic-item-desc">{item.texto}</div>

                  {/* C */}
                  <div className="ic-item-opt">
                    <button
                      type="button"
                      className={`ic-opt-btn ic-opt-btn--c ${resp === 'C' ? 'ic-opt-btn--selected' : ''}`}
                      onClick={() => setResposta(item.id, 'C')}
                    >C</button>
                  </div>

                  {/* NC */}
                  <div className="ic-item-opt">
                    <button
                      type="button"
                      className={`ic-opt-btn ic-opt-btn--nc ${resp === 'NC' ? 'ic-opt-btn--selected' : ''}`}
                      onClick={() => setResposta(item.id, 'NC')}
                    >NC</button>
                  </div>

                  {/* NA */}
                  <div className="ic-item-opt">
                    <button
                      type="button"
                      className={`ic-opt-btn ic-opt-btn--na ${resp === 'NA' ? 'ic-opt-btn--selected' : ''}`}
                      onClick={() => setResposta(item.id, 'NA')}
                    >NA</button>
                  </div>

                  {/* Obs para itens NC */}
                  {isNC && (
                    <div className="ic-item-obs">
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
      ))}

      {/* ── OBSERVAÇÕES GERAIS E ASSINATURAS ── */}
      <div className="ic-card">
        <div className="ic-card-header">
          <i className="bi bi-chat-left-text" />
          <h2>Observações e Assinaturas</h2>
        </div>
        <div className="ic-card-body">
          <div className="ic-fgroup" style={{ marginBottom: '1.5rem' }}>
            <label>Observações gerais (opcional)</label>
            <textarea
              value={obsGeral}
              onChange={e => setObsGeral(e.target.value)}
              placeholder="Registre qualquer observação adicional sobre a inspeção..."
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="ic-assinaturas">
            <div className="ic-sig-field">
              <div className="ic-sig-label">Inspecionado por</div>
              <div className="ic-sig-value">{usuario.nome}</div>
              <div className="ic-sig-cargo">{usuario.cargo}</div>
            </div>
            <div className="ic-sig-field ic-sig-field--pendente">
              <div className="ic-sig-label">Finalizado por</div>
              <div className="ic-sig-value ic-sig-pending">Aguardando aprovação do líder</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AÇÕES ── */}
      <div className="ic-form-actions">
        <div className="ic-progress-info">
          {progresso < total
            ? <span className="ic-text-warn"><i className="bi bi-exclamation-circle" /> {total - progresso} itens sem resposta</span>
            : <span className="ic-text-ok"><i className="bi bi-check-circle" /> Todos os itens respondidos</span>
          }
        </div>
        <button className="ic-btn-primary" onClick={handleEnviar} disabled={enviando}>
          {enviando
            ? <><i className="bi bi-hourglass-split" /> Enviando...</>
            : <><i className="bi bi-send-check" /> Enviar para Aprovação</>
          }
        </button>
      </div>

    </div>
  )
}
