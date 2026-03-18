// ============================================================
// src/pages/PT/components/FormularioPT.jsx
// Formulário completo de emissão de Permissão de Trabalho
// ============================================================

import { useState, useEffect } from 'react'
import { APR_MAP, RISCOS_BASE, EPIS_LISTA, MEDIDAS_CONTROLE, TIPOS_TRABALHO } from '../../../data/aprData'
import { gerarPDF } from '../utils/gerarPDF'
import './FormularioPT.css'

// ── Gera número de PT único
function gerarNumeroPT() {
  const ano = new Date().getFullYear()
  const num = String(Math.floor(Math.random() * 9000) + 1000)
  return `PT-${ano}-${num}`
}

// ── Estado inicial do formulário
function estadoInicial() {
  return {
    empresa: '',
    cnpj: '',
    responsavel: '',
    cargo: '',
    local: '',
    setor: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    turno: '',
    tipoTrabalho: '',
    descricao: '',
    risco: '',
    observacoes: '',
    tecnico: '',
    registro: '',
  }
}

export default function FormularioPT({ empresa, usuario, onPTGerada }) {
  const [ptNum, setPtNum]     = useState(gerarNumeroPT)
  const [form, setForm]       = useState({ ...estadoInicial(), tecnico: usuario.nome })
  const [riscos, setRiscos]   = useState({}) // { id: 'manual' | 'auto' | false }
  const [riscosExtra, setRiscosExtra] = useState([]) // riscos dinâmicos
  const [epis, setEpis]       = useState({}) // { id: true | false }
  const [medidas, setMedidas] = useState({})
  const [aprBanner, setAprBanner] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [erro, setErro]       = useState('')

  // ── EPIs obrigatórios sempre ativos
  const EPIS_OBRIGATORIOS = EPIS_LISTA.filter(e => e.obrigatorio).map(e => e.id)

  // ── Atualiza campo do formulário
  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // ── Ao mudar tipo de trabalho, aplica APR dinâmica
  useEffect(() => {
    const map = APR_MAP[form.tipoTrabalho]
    if (!map) {
      // Limpa sugestões automáticas
      setRiscos(prev => {
        const novo = { ...prev }
        Object.keys(novo).forEach(k => { if (novo[k] === 'auto') delete novo[k] })
        return novo
      })
      setRiscosExtra([])
      setAprBanner('')
      return
    }

    // Marca riscos base como auto
    const novosRiscos = {}
    map.precheck.forEach(id => { novosRiscos[id] = 'auto' })
    setRiscos(prev => {
      const merged = { ...prev }
      // Remove auto anteriores, mantém manuais
      Object.keys(merged).forEach(k => { if (merged[k] === 'auto') delete merged[k] })
      Object.assign(merged, novosRiscos)
      return merged
    })

    // Riscos extras
    setRiscosExtra(map.extra.map(label => ({ label, auto: true, ativo: true })))

    // EPIs sugeridos
    const novosEpis = {}
    map.epi.forEach(id => { if (!EPIS_OBRIGATORIOS.includes(id)) novosEpis[id] = true })
    setEpis(prev => {
      const merged = { ...prev }
      Object.assign(merged, novosEpis)
      return merged
    })

    // Nível de risco sugerido
    setField('risco', map.risco)

    setAprBanner(`Com base em "${form.tipoTrabalho}", ${map.extra.length} riscos inerentes foram identificados automaticamente.`)

  }, [form.tipoTrabalho])

  // ── Toggle risco base
  function toggleRisco(id) {
    setRiscos(prev => {
      const atual = prev[id]
      if (atual === 'auto') return { ...prev, [id]: 'manual' }    // auto → manual ativo
      if (atual === 'manual') return { ...prev, [id]: false }      // manual → desmarcado
      return { ...prev, [id]: 'manual' }                           // false/undefined → manual
    })
  }

  // ── Toggle risco extra
  function toggleRiscoExtra(idx) {
    setRiscosExtra(prev => prev.map((r, i) => i === idx ? { ...r, ativo: !r.ativo } : r))
  }

  // ── Toggle EPI (obrigatórios não podem ser desmarcados)
  function toggleEpi(id) {
    if (EPIS_OBRIGATORIOS.includes(id)) return
    setEpis(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // ── Toggle medida
  function toggleMedida(label) {
    setMedidas(prev => ({ ...prev, [label]: !prev[label] }))
  }

  // ── Coleta dados para o PDF
  function coletarDados() {
    const riscosAtivos = [
      ...RISCOS_BASE.filter(r => riscos[r.id] === 'manual' || riscos[r.id] === 'auto').map(r => r.label),
      ...riscosExtra.filter(r => r.ativo).map(r => r.label),
    ]
    const episAtivos = [
      ...EPIS_OBRIGATORIOS,
      ...EPIS_LISTA.filter(e => !e.obrigatorio && epis[e.id]).map(e => e.id),
    ]
    const medidasAtivas = MEDIDAS_CONTROLE.filter(m => medidas[m])

    return {
      pt: ptNum,
      ...form,
      riscos: riscosAtivos,
      epis: episAtivos,
      medidas: medidasAtivas,
      emitidoEm: new Date().toLocaleString('pt-BR'),
    }
  }

  // ── Validação
  function validar(dados) {
    const obrigatorios = {
      empresa: 'Empresa Solicitante',
      responsavel: 'Responsável pelo Serviço',
      local: 'Local / Área de Trabalho',
      dataInicio: 'Data de Início',
      dataFim: 'Data de Término',
      tipoTrabalho: 'Tipo de Trabalho',
      descricao: 'Descrição do Serviço',
      risco: 'Nível de Risco',
    }
    const faltando = Object.entries(obrigatorios)
      .filter(([k]) => !dados[k])
      .map(([, v]) => v)
    return faltando
  }

  // ── Gerar PDF
  async function handleGerar() {
    setErro('')
    const dados = coletarDados()
    const faltando = validar(dados)
    if (faltando.length) {
      setErro(`Preencha os campos obrigatórios:\n• ${faltando.join('\n• ')}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setGerando(true)
    try {
      await gerarPDF(dados, empresa)
      onPTGerada(dados)
      setModalAberto(true)
    } catch (e) {
      setErro('Erro ao gerar o PDF. Tente novamente.')
    }
    setGerando(false)
  }

  // ── Limpar formulário
  function limpar() {
    if (!window.confirm('Limpar todos os campos?')) return
    setForm({ ...estadoInicial(), tecnico: usuario.nome })
    setRiscos({})
    setRiscosExtra([])
    setEpis({})
    setMedidas({})
    setAprBanner('')
    setErro('')
    setPtNum(gerarNumeroPT())
  }

  // ── Fechar modal e resetar
  function fecharModal() {
    setModalAberto(false)
    limparSemConfirmar()
  }

  function limparSemConfirmar() {
    setForm({ ...estadoInicial(), tecnico: usuario.nome })
    setRiscos({}); setRiscosExtra([]); setEpis({}); setMedidas({})
    setAprBanner(''); setErro('')
    setPtNum(gerarNumeroPT())
  }

  return (
    <div className="form-pt-wrap">

      {/* Cabeçalho */}
      <div className="form-pt-header">
        <div>
          <h1>Emissão de Permissão de Trabalho</h1>
          <p>Preencha todos os campos obrigatórios antes de gerar o documento.</p>
        </div>
        <div className="pt-numero">
          <span>Número da PT</span>
          <strong>{ptNum}</strong>
        </div>
      </div>

      {/* Erro global */}
      {erro && (
        <div className="form-pt-erro">
          <i className="bi bi-exclamation-circle" />
          <pre>{erro}</pre>
        </div>
      )}

      {/* ── 1. IDENTIFICAÇÃO ── */}
      <div className="pt-card">
        <div className="pt-card-header">
          <i className="bi bi-building" /><h2>Identificação</h2>
        </div>
        <div className="pt-card-body">
          <div className="pt-grid pt-grid-2">
            <div className="pt-fgroup">
              <label>Empresa Solicitante <span className="req">*</span></label>
              <input value={form.empresa} onChange={e => setField('empresa', e.target.value)} placeholder="Razão social da empresa" />
            </div>
            <div className="pt-fgroup">
              <label>CNPJ / CPF</label>
              <input value={form.cnpj} onChange={e => setField('cnpj', e.target.value)} placeholder="00.000.000/0001-00" />
            </div>
            <div className="pt-fgroup">
              <label>Responsável pelo Serviço <span className="req">*</span></label>
              <input value={form.responsavel} onChange={e => setField('responsavel', e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="pt-fgroup">
              <label>Cargo / Função</label>
              <input value={form.cargo} onChange={e => setField('cargo', e.target.value)} placeholder="Ex: Eletricista, Caldeireiro..." />
            </div>
            <div className="pt-fgroup">
              <label>Local / Área de Trabalho <span className="req">*</span></label>
              <input value={form.local} onChange={e => setField('local', e.target.value)} placeholder="Ex: Subestação, Tanque T-04..." />
            </div>
            <div className="pt-fgroup">
              <label>Setor / Planta</label>
              <input value={form.setor} onChange={e => setField('setor', e.target.value)} placeholder="Ex: Utilidades, Manutenção..." />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. PERÍODO E TIPO ── */}
      <div className="pt-card">
        <div className="pt-card-header">
          <i className="bi bi-calendar3" /><h2>Período e Tipo de Serviço</h2>
        </div>
        <div className="pt-card-body">
          <div className="pt-grid pt-grid-3" style={{ marginBottom: '1rem' }}>
            <div className="pt-fgroup">
              <label>Data de Início <span className="req">*</span></label>
              <input type="date" value={form.dataInicio} onChange={e => setField('dataInicio', e.target.value)} />
            </div>
            <div className="pt-fgroup">
              <label>Data de Término <span className="req">*</span></label>
              <input type="date" value={form.dataFim} onChange={e => setField('dataFim', e.target.value)} />
            </div>
            <div className="pt-fgroup">
              <label>Turno</label>
              <select value={form.turno} onChange={e => setField('turno', e.target.value)}>
                <option value="">Selecione...</option>
                <option>Diurno (06h–18h)</option>
                <option>Noturno (18h–06h)</option>
                <option>Integral (24h)</option>
              </select>
            </div>
          </div>
          <div className="pt-fgroup">
            <label>Tipo de Trabalho <span className="req">*</span></label>
            <select value={form.tipoTrabalho} onChange={e => setField('tipoTrabalho', e.target.value)}>
              <option value="">Selecione o tipo de serviço...</option>
              {TIPOS_TRABALHO.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="pt-fgroup" style={{ marginTop: '1rem' }}>
            <label>Descrição Detalhada do Serviço <span className="req">*</span></label>
            <textarea value={form.descricao} onChange={e => setField('descricao', e.target.value)} placeholder="Descreva detalhadamente as atividades, equipamentos e método de trabalho..." />
          </div>
        </div>
      </div>

      {/* ── 3. NÍVEL DE RISCO ── */}
      <div className="pt-card">
        <div className="pt-card-header">
          <i className="bi bi-exclamation-triangle" /><h2>Nível de Risco</h2>
        </div>
        <div className="pt-card-body">
          <div className="pt-fgroup">
            <label>Classificação de Risco <span className="req">*</span></label>
            <div className="risco-group">
              {['Baixo', 'Médio', 'Alto'].map(r => (
                <button
                  key={r}
                  type="button"
                  className={`risco-btn risco-btn--${r.toLowerCase()} ${form.risco === r ? 'risco-btn--active' : ''}`}
                  onClick={() => setField('risco', r)}
                >
                  {r === 'Baixo' ? '🟢' : r === 'Médio' ? '🟡' : '🔴'} {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. APR ── */}
      <div className="pt-card">
        <div className="pt-card-header">
          <i className="bi bi-shield-check" /><h2>Análise Preliminar de Riscos</h2>
        </div>
        <div className="pt-card-body">
          {aprBanner && (
            <div className="apr-banner">
              <i className="bi bi-stars" />
              <div>
                <strong>Riscos identificados automaticamente</strong>
                <span>{aprBanner} Revise e ajuste conforme necessário.</span>
              </div>
            </div>
          )}
          <p className="pt-hint">Marque todos os riscos identificados na execução do serviço:</p>
          <div className="checklist">
            {RISCOS_BASE.map(r => {
              const estado = riscos[r.id]
              const ativo  = estado === 'manual' || estado === 'auto'
              return (
                <div
                  key={r.id}
                  className={`check-item ${ativo ? (estado === 'auto' ? 'check-item--auto' : 'check-item--checked') : ''}`}
                  onClick={() => toggleRisco(r.id)}
                >
                  <div className="check-box">{ativo ? '✓' : ''}</div>
                  {r.label}
                </div>
              )
            })}
          </div>
          {riscosExtra.length > 0 && (
            <div className="checklist" style={{ marginTop: '0.5rem' }}>
              {riscosExtra.map((r, i) => (
                <div
                  key={i}
                  className={`check-item ${r.ativo ? 'check-item--auto' : ''}`}
                  onClick={() => toggleRiscoExtra(i)}
                >
                  <div className="check-box">{r.ativo ? '✓' : ''}</div>
                  {r.label}
                  <span className="suggested-tag"><i className="bi bi-stars" /> sugerido</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 5. EPIs ── */}
      <div className="pt-card">
        <div className="pt-card-header">
          <i className="bi bi-person-badge" /><h2>Equipamentos de Proteção Individual (EPIs)</h2>
        </div>
        <div className="pt-card-body">
          <p className="pt-hint">Selecione os EPIs obrigatórios para este serviço:</p>
          <div className="epi-grid">
            {EPIS_LISTA.map(e => {
              const obrig = e.obrigatorio
              const ativo = obrig || epis[e.id]
              return (
                <div
                  key={e.id}
                  className={`epi-item ${ativo ? 'epi-item--active' : ''} ${obrig ? 'epi-item--obrig' : ''}`}
                  onClick={() => toggleEpi(e.id)}
                >
                  {obrig && <span className="epi-obrig-badge">Obrig.</span>}
                  <i className={`bi ${e.icone}`} />
                  {e.label}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 6. MEDIDAS ── */}
      <div className="pt-card">
        <div className="pt-card-header">
          <i className="bi bi-list-check" /><h2>Medidas de Controle e Condicionantes</h2>
        </div>
        <div className="pt-card-body">
          <div className="checklist">
            {MEDIDAS_CONTROLE.map(m => (
              <div
                key={m}
                className={`check-item ${medidas[m] ? 'check-item--checked' : ''}`}
                onClick={() => toggleMedida(m)}
              >
                <div className="check-box">{medidas[m] ? '✓' : ''}</div>
                {m}
              </div>
            ))}
          </div>
          <div className="pt-fgroup" style={{ marginTop: '1rem' }}>
            <label>Observações e Condicionantes Adicionais</label>
            <textarea value={form.observacoes} onChange={e => setField('observacoes', e.target.value)} placeholder="Registre condições específicas, restrições ou instruções complementares..." />
          </div>
        </div>
      </div>

      {/* ── 7. EMITENTE ── */}
      <div className="pt-card">
        <div className="pt-card-header">
          <i className="bi bi-pen" /><h2>Emissão e Responsabilidade</h2>
        </div>
        <div className="pt-card-body">
          <div className="pt-grid pt-grid-2" style={{ marginBottom: '1.2rem' }}>
            <div className="pt-fgroup">
              <label>Técnico de Segurança Responsável <span className="req">*</span></label>
              <input value={form.tecnico} onChange={e => setField('tecnico', e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="pt-fgroup">
              <label>Matrícula / CREA / CRQ</label>
              <input value={form.registro} onChange={e => setField('registro', e.target.value)} placeholder="Número de registro profissional" />
            </div>
          </div>
          <div className="sig-area">
            <div className="sig-box"><div className="sig-label">Assinatura — Técnico de Segurança</div></div>
            <div className="sig-box"><div className="sig-label">Assinatura — Responsável pelo Serviço</div></div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="form-pt-actions">
        <button className="btn-ghost-pt" onClick={limpar}>
          <i className="bi bi-arrow-counterclockwise" /> Limpar formulário
        </button>
        <button className="btn-primary-pt" onClick={handleGerar} disabled={gerando}>
          {gerando
            ? <><i className="bi bi-hourglass-split" /> Gerando PDF...</>
            : <><i className="bi bi-file-earmark-pdf" /> Gerar Permissão de Trabalho</>
          }
        </button>
      </div>

      {/* Modal de sucesso */}
      {modalAberto && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && fecharModal()}>
          <div className="modal-box">
            <div className="modal-icon"><i className="bi bi-check-lg" /></div>
            <h3>PT Gerada com Sucesso</h3>
            <p>A Permissão de Trabalho <strong>{ptNum}</strong> foi gerada e o download do PDF iniciou automaticamente.</p>
            <div className="modal-actions">
              <button className="btn-ghost-pt" onClick={fecharModal}>Fechar</button>
              <button className="btn-primary-pt" onClick={fecharModal}>
                <i className="bi bi-plus-lg" /> Nova PT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
